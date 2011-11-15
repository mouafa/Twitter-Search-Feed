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