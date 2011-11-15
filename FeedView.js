/**
 * Copyright (c) Ken Colton, 2011
 *
 * Released under GPL V3 Licence. See GPL-LICENSE.txt for more information
 *
 * THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY 
 * KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
 * PARTICULAR PURPOSE.
 */

/**
 * Class for handling the view side of a feed
 */
function FeedView(parent)
{
    var _this = this;
    
    _this.parent = parent;              // Ref to parent Feed
    _this.options = parent.options;     // Shortcut to the parents options
    
    _this.$node = _this.options.$node;  // Grab the node
    _this.$viewport = null;             // Our viewport
    _this.$feed = null;                 // Our feed
    
    _this.construct();                  // Build the view
}

FeedView.prototype = {
    
    /**
     * Construct the view
     */
    construct: function()
    {
        var _this = this;
        
        _this.$node.addClass('TwitterSearchFeed');
        _this.$node.append('<div class="TwitterSearchFeed_fade"></div>');
        
        // Create the viewport and append
        _this.$viewport = $('<div class="TwitterSearchFeed_viewport"></div>').appendTo(_this.$node);
        _this.$viewport.css('height', _this.options.viewportHeight);
        
        // Create the feed div
        _this.$feed = $('<div class="TwitterSearchFeed_feed"></div>').appendTo(_this.$viewport);
    },
    
    /**
     * Are we approaching the bottom of the view
     * (within 3 viewports of bottom)
     */
    isRunningOut: function()
    {
        var _this = this;
        
        return _this.$viewport.scrollTop() > _this.$feed.height() - 3 * _this.options.viewportHeight;
    },
    
    /**
     * Add the given results to the top of the view with animation by default
     */
    displayAtTop: function(tweets, animation)
    {
        var _this = this;
        
        // Create a transport div
        var $transport = $('<div class="TwitterSearchFeed_tweet_transport"></div>');
        
        // Loop through the tweets, constructing view node and putting it in the transporter
        $.each(tweets, function() {
            var tweet = this;
            
            $node = tweet.getNode();
            
            $transport.prepend($node);
        });
        
        _this.$feed.prepend($transport);
        
        // Grab the computed transport height
        var transportHeight = $transport.height();
        
        
        var scrollTop = _this.$viewport.scrollTop();
        
        if (scrollTop == 0) {
        
            // Set the position of the transport out of view
            $transport.css('margin-top', 0 - transportHeight).show();
            
            // Animate the transport in
            $transport.animate({'margin-top': 0}, 400, 'swing', function() {
                // Once this is complete, remove the children from the transport
                $transport.children().prependTo($transport.parent());
                $transport.remove();
            });
        
        } else {
            
            _this.$feed.prepend($transport);
            $transport.show();
            _this.$viewport.scrollTop(scrollTop + transportHeight);
            
            // Once this is complete, remove the children from the transport
            $transport.children().prependTo($transport.parent());
            $transport.remove();
        }

    },
    
    /**
     * Add the given results to the bottom of the view immediately, no animation
     */
    displayAtBottom: function(tweets)
    {
        var _this = this;
        
        // Loop through the tweets, constructing view node and adding to bottom
        $.each(tweets, function() {
            var tweet = this;
            
            $node = tweet.getNode();
            
            _this.$feed.append($node);
        });
    }
    
};