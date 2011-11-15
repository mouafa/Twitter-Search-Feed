/**
 * Copyright (c) 2011 Ken Colton
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * License available in GPL-LICENSE.txt or <http://www.gnu.org/licenses/>.
 */
 
/**
 * Class for handling the logic of the awesome twitter feed
 */
function Feed(parent)
{
    var _this = this;
        
    _this.parent = parent;              // Set references to parent
    _this.options = parent.options;     // Shortcut to options
    
    _this.reachedBottom = false;        // Have we reached the bottom of the feed
    _this.searchSinceId = null;         // What ID should we search after
    _this.searchMaxId = null;           // What ID should we search up to
    _this.searchInProgress = false;     // Are we aready searching
    _this.updateTimeout = null;         // The timeout for preforming updates
    
    // Helpers
    _this.api = new TwitterSearch();
    _this.view = new FeedView(_this);
    _this.buffer = new FeedBuffer(_this);
    
    // Start her up
    _this.init();
}

Feed.prototype = {
    
    /**
     * Initialize the feed
     */
    init: function()
    {
        var _this = this;
        
        // Do an initial prefetch, and add a callback to start the updating once that returns
        _this.checkPrefetch(function()
        {
            _this.update();
        });
        
        // Bind a check of the prefetch at each scroll
        _this.view.$viewport.bind('scroll', function() {
            _this.checkPrefetch();
        });
    },
    
    /**
     * Start updating now
     */
    update: function()
    {
        var _this = this;
        
        // Set the search options
        var options = {
            sinceId: _this.searchSinceId
        };
        
        // Set the buffer to the stuff we got on callback
        var successCallback = function(data)
        {   
            // Update the since id for the next search
            if (data.results.length > 0) {
                // Grab the highest id
                _this.searchSinceId = data.results[0].id_str;
            }
            
            _this.buffer.set(Tweet.constructArray(_this, data.results));
            
            // Clear the status
            _this.parent.clearStatus();
        };
        
        var failureCallback = function(data)
        {
            // Set error
            _this.parent.setStatus('error', 'We could not communicate with Twitter Search. Perhaps it is down? We will keep trying.');
        };
        
        // Set the status to loading
        _this.parent.setStatus('loading');
        
        // Perform the search
        _this.api.search(_this.options.search, successCallback, failureCallback, options);
        
        // Schedule the next update
        _this.updateTimeout = setTimeout(function()
        {
            _this.update();
        }, _this.options.updateSecs * 1000);
    },
    
    /**
     * Check if we should prefetch more stuff
     */
    checkPrefetch: function(doneFetchingCallback)
    {
        var _this = this;
        
        // If we reached the bottom of the feed, theres nothing more to fetch
        // If we already already search, dont run
        // If we are not running out of view space, then no need  to fetch
        if (_this.reachedBottom || _this.searchInProgress || !_this.view.isRunningOut()) { return; }
        
        // Start the search
        _this.searchInProgress = true;
        
        // Create the callback for success
        var successCallback = function(data) 
        {   
            // If there are any results
            if (data.results.length > 0) {
            
                // If this is first prefetch, we have to set since id
                if (!_this.searchSinceId) {
                    _this.searchSinceId = data.results[0].id_str;
                }

                // Set the new max id
                _this.searchMaxId = data.results[data.results.length-1].id_str;

                // Add the results to the bottom of the view
                _this.view.displayAtBottom(Tweet.constructArray(_this, data.results));
                
            } else {
                
                _this.reachedBottom = true;
                
            }
        
            
            
            // Check if a callback was provided
            if (doneFetchingCallback != null) { doneFetchingCallback(data); }
            
            // No longer searching
            _this.searchInProgress = false;
            
            // Clear the status
            _this.parent.clearStatus();
        };
        
        // Create callback for error conditions
        var failureCallback = function()
        {
            // Check if a callback was provided
            if (doneFetchingCallback != null) { doneFetchingCallback(); }
            
            // No longer searching
            _this.searchInProgress = false;
            
            // Set error
            _this.parent.setStatus('error', 'We could not communicate with Twitter Search. Perhaps it is down? We will keep trying.');
        };
        
        // Set the status to loading
        _this.parent.setStatus('loading');
        
        // Set the options
        var options = {
            maxId: _this.searchMaxId
        };
        
        // Search
        _this.api.search(_this.options.search, successCallback, failureCallback, options);
    },
    
    /**
     * Destroy our feed view and kill our timers
     */
    destroy: function()
    {
        var _this = this;
        
        // Kill the update timeout so we dont update in the background
        clearTimeout(_this.updateTimeout);
        
        // Kill the view
        _this.view.destroy();
    }
    
};