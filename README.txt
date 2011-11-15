===== Twitter Search Feed =====

** CAUTION: This is still a work in progress **

Copyright (c) Ken Colton, 2011

Released under GPL V3 Licence. See GPL-LICENSE.txt for more information

THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY 
KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
PARTICULAR PURPOSE.

===== Description =====

A JavaScript, 100% client-side real time Twitter Search Feed.

===== Usage =====

See demo.html for complete usage.

// Create the feed
new TwitterSearchFeed({
    $node: $('#feed'),      // The jquery node set representing the feed
    search: 'skyrim',       // The search term
    viewportHeight: 300     // The viewport height
});

