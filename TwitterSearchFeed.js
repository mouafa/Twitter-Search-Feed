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
