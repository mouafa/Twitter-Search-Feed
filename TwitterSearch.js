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
 * Class for performing searches against Twitter in an organized way so we don't 
 * anger the Twitter rate limit gods
 */
function TwitterSearch()
{
    var _this = this;
    
    _this.rateLimitSecs = 5;        // How often we are allowed to ping search api
    _this.requestQueue = [];        // Manages our request queue
    
    _this.processTimeout = null;    // Timeout for the next call to process
    _this.lastSearchTime = null;    // When did the last search get issued (in ms)
}

TwitterSearch.prototype = {
    
    /**
     * Add a search request to our queue
     */
    search: function(search, successCallback, failureCallback, options)
    {
        var _this = this;
    
        // Create the request
        var request = new TwitterSearchRequest(search, successCallback, failureCallback, options);
        
        // Put it at the end of the queue
        _this.requestQueue.push(request);
        
        // Try and process the request from the queue
        _this.process();
    },
    
    /**
     * Processes the queue in a way that doesn't violate the rate limit
     */
    process: function()
    {
        var _this = this;
        
        // Kill the process timeout
        if (_this.processTimeout) { 
            clearTimeout(_this.processTimeout);
            _this.processTimeout = null; 
        }
        
        // Check if we can search again and there is something to do
        if (_this.canSearchAgain() && _this.requestQueue.length > 0) {
        
            // Yes, we can search, so execute the next query
            _this.requestQueue.shift().execute();
            _this.lastSearchTime = new Date().getTime();
            
            _this.timeoutLength = _this.rateLimitSecs * 1000;
        } else {
            
            // Ok, we cant search, so set our timeout length to when we can
            var timeoutLength = _this.lastSearchTime - new Date().getTime() + (_this.rateLimitSecs * 1000);
            // Add a bit of padding to be sure
            timeoutLength += 250;
            
        }
                
        // Set the timeout if there is more processing to do
        if (_this.requestQueue.length > 0) {
            _this.processTimeout = setTimeout(function() {
                _this.process();
            }, timeoutLength);
        }
        
    },
    
    /**
     * Checks if we can search again
     */
    canSearchAgain: function()
    {
        var _this = this;
        
        // Check if we never searched before
        if (_this.lastSearchTime == null) { return true; }
        
        // Return if it was out of our rate limited window
        return new Date().getTime() - _this.rateLimitSecs * 1000 >= _this.lastSearchTime;
    }
    
};