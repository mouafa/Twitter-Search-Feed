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
 * Base class for creating a TwitterSearchFeed
 *
 * Options:
 *   $node
 *   search
 *   viewportHeight
 *   updateSecs
 *   minDelaySecs
 */
function TwitterSearchFeed(userOptions)
{
    var _this = this;
    
    // Create the options with our defaults
    _this.options = {
        viewportHeight: 500,
        updateSecs: 30,
        minDelaySecs: 2,
        userId: null
    };
    
    // Merge in the user options
    _this.options = $.extend(_this.options, userOptions);
    
    // Grab node
    _this.$node = _this.options.$node;
    
    // Grab reference to status box
    _this.$status = _this.$node.find('.TwitterSearchFeed_status');
    
    // Create our helper objects
    _this.feed = new Feed(_this);
}

TwitterSearchFeed.prototype = {
    
    setStatus: function(type, text)
    {
        var _this = this;
        
        switch (type) {
            case 'error':
                _this.$status.html('<div class="TwitterSearchFeed_error">' + text + '</div>');
                break;
            case 'loading':
                _this.$status.html('<img src="images/spinner.gif" />');
                break;
        }
    },
    
    clearStatus: function()
    {
        var _this = this;
        // Clear out the status children
        _this.$status.children().remove();
    }
};
