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
 * A class for managing individual tweets
 */
function Tweet(parent, data)
{
    var _this = this;
    
    _this.parent = parent;              // Ref to parent Feed
    _this.options = parent.options;     // Shortcut to options
    _this.data = data;                  // Store the tweet data
    
    _this.$node = null;                 // The node representing this tweet
}

Tweet.prototype = {
    
    /**
     * Construct the view node from the raw data
     */
    getNode: function()
    {
        var _this = this;
        
        // Check if its already been created
        if (_this.$node != null) { return _this.$node; }
        
        // Create the node
        var $node = $('<div class="TwitterSearchFeed_tweet"></div>');
        
        var $picture = $('<a class="TwitterSearchFeed_tweet_profileImage"></a>')
            .attr('href', 'http://twitter.com/' + _this.data.from_user)
            .attr('target', '_blank')
            .append(
                $('<img />').attr('src', _this.data.profile_image_url)
            ).appendTo($node);
        
        var $content = $('<div class="TwitterSearchFeed_tweet_content"></div>').appendTo($node);
        $node.append('<div class="TwitterSearchFeed_tweet_clear"></div>');

        $('<a class="TwitterSearchFeed_tweet_user"></a>')
            .attr('href', 'http://twitter.com/' + _this.data.from_user)
            .attr('target', '_blank')
            .text(_this.data.from_user)
            .appendTo($content);
        
        $('<span class="TwitterSearchFeed_tweet_text"></span>')
            .html(_this.parseTweetText(_this.data.text))
            .appendTo($content);
        
        var date = new Date(_this.data.created_at);
        
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        
        var minute = date.getMinutes();
        if (minute < 10) { minute = '0' + minute; }
        
        var ampm = hour > 11 ? 'pm' : 'am';
        if (hour > 12) { hour = hour - 12; }
        if (hour == 0) { hour = 12; }

        var dateString = month + '/' + day + '/' + year + ' ' + hour + ':' + minute + ' ' + ampm;    

        $('<div class="TwitterSearchFeed_tweet_time"></div>')
            .attr('title', _this.data.created_at)
            .text(dateString)
            .prettyDate()
            .appendTo($content);
        
        // Return the invisible node
        return $node;
    },
    
    /**
     * Parses the tweet text looking for @mentions and urls to turn into links
     */
    parseTweetText: function(text)
    {
        // Hack for making sure theres a space at the end for our regexs to work off
        text += ' ';
        
        // Wrap URLs in anchor tags
        text = text.replace(/(https?\:\/\/\S+)(\s)/gi, function()
        {
            var url = arguments[1];
            var delimiter = arguments[2];
            return '<a href="' + url + '" target="_blank">' + url + '</a>' + delimiter;
        });
        
        // @ mentions
        text = text.replace(/@(\w+)(\W)/gi, function()
        {
            var username = arguments[1];
            var delimiter = arguments[2];
            return '<a href="http://twitter.com/' + username + '" target="_blank">@' + username + '</a>' + delimiter;
        });
        
        return text;
    }
};

/**
 * A static helper function to convert an array of raw data to an array of tweets
 */
Tweet.constructArray = function(parent, tweets)
{
    var out = [];
    
    // Loop through the array of tweet data and create a tweet in the new array
    $.each(tweets, function() {
        out.push(new Tweet(parent, this));
    });
    
    return out;
};
