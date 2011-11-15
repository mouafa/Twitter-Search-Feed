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
 * Class for maintaining a buffer of tweets and distributing them
 */
function FeedBuffer(parent)
{
    var _this = this;
    
    _this.parent = parent;              // Reference to the parent Feed
    _this.options = parent.options;     // Shortcut to the options
    
    // Compute the maximum # of tweets we can display nicely
    _this.maxTweets = _this.options.updateSecs / _this.options.minDelaySecs;
    
    _this.tweets = [];                  // Our queue of tweets to add
    _this.timeout = null;               // The timeout used to control the tweet rate
    _this.processRateSecs = null;       // How many seconds between processes
}

FeedBuffer.prototype = {

    /**
     * Give the buffer the latest round to display
     */
    set: function(tweets)
    {
        var _this = this;
        
        // Stop the old processing routine
        _this.stop();
        
        // Set the tweets from what we were given
        _this.tweets = tweets;
        
        if (_this.tweets.length > _this.maxTweets) {
            // We have too many tweets to display nicely
            // Spit out overflow & set process rate to minimum
            _this.processRateSecs = _this.options.minDelaySecs;
            
            var spitTweets = _this.tweets.splice(0, _this.tweets.length - _this.maxTweets);
            
            _this.parent.view.displayAtTop(spitTweets, 'slide');
            
            // Schedule the next process
            _this.timeout = setTimeout(function() {
                _this.process();
            }, _this.processRateSecs * 1000);
            
        } else {
            // We can display these nicely
            _this.processRateSecs = _this.options.updateSecs / _this.tweets.length;
            
            // Start processing again
            _this.process();
        }
    },
    

    /**
     * Stop the buffer from processing
     */
    stop: function()
    {
        var _this = this;
        
        // Clear the timeout if its still set
        if (_this.timeout) {
            clearTimeout(_this.timeout);
        }
        
        // Display any left over tweets
        if (_this.tweets.length > 0) {
            _this.parent.view.displayAtTop(_this.tweets, 'slide');
            _this.tweets = [];
        }
    },
    
    /**
     * Process a tweet from the queue
     */
    process: function()
    {
        var _this = this;
        
        // Shift the next tweet from the bottom
        var tweet = _this.tweets.shift();
        
        // If none left, exist
        if (tweet == null) { return; }
        
        // Display it at the top of the feed
        _this.parent.view.displayAtTop([tweet], 'slide');
        
        // Set the next time we process
        _this.timeout = setTimeout(function() {
            _this.process();
        }, _this.processRateSecs * 1000);
    }

};