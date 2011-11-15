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
 * Class for keeping track of request data in the queue
 */
function TwitterSearchRequest(search, successCallback, failureCallback, options)
{
    var _this = this;
    
    _this.search = search;
    _this.successCallback = successCallback;
    _this.failureCallback = failureCallback;
    
    _this.failureTimeout = null;
    
    _this.options = options;
}

TwitterSearchRequest.prototype = {
    
    /**
     * Execute a search against twitters API and return data to the callback
     */
    execute: function()
    {
        var _this = this;
    
        var searchData = {
            q: _this.search,
            rpp: 50
        };
        
        // Check for advanced options
        if (_this.options.sinceId) {
            searchData.since_id = _this.options.sinceId;
        }
        
        if (_this.options.maxId) {
            searchData.max_id = _this.options.maxId;
        }
                
        $.ajax({
            url: 'http://search.twitter.com/search.json',
            data: searchData,
            dataType: 'jsonp',
            success: function(data) {
                
                // Clear the error timeout
                clearTimeout(_this.failureTimeout);
                
                // Check for well formed search results
                if (data.results) {
                    
                    // Call the callback with the data
                    _this.successCallback(data);
                    
                } else {
                    
                    // Something didnt come back right, error
                    _this.errorCallback(data);
                    
                }
                
            }
        });
        
        // Set a timeout waiting for an error
        _this.failureTimeout = setTimeout(function()
        {
            _this.failureCallback();
        }, 7000);
    }
    
};