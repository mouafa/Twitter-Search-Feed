===== Twitter Search Feed =====

** CAUTION: This is still a work in progress **

Copyright (c) 2011 Ken Colton

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

License available in GPL-LICENSE.txt or <http://www.gnu.org/licenses/>.

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

