barter
======

Barter is an interface that connects you to your community and allows you to trade items with other users and share the story behind them.

Users are able to post items, as well as, geospatially browse through the posts.

Barter provides a trade request and messaging system to assist in the bartering process.

Barter uses Facebook authentication to log in and track users' posts.

Barter is currently available at http://barter-app.herokuapp.com

Screenshots:

Coming soon...

Tech Stack:

Barter is built on with a MEAN stack (Mongo, Express, Angular, Node). Additional front end libaries that were used are angularjs-imageupload, markerclusterer, and OverlappingMarkerSpiderfier. On the serverside, libaries used include mongoose, handlebars, passport, stylus, and bower.

Challenges:

Getting Google Maps to work efficiently with Angular was a significant issue. Connections between the two took some time because changes inside the map were not directly noticed by Angular; however, using $rootScope.$digest to update the views solved this issue.

Another obstacle was to design for a fluid and intuitive user experience. This was accomplished by allowing instant search in the sidebar and by using two versions of clustering to simplify the geospatial search process.

...A map of your codebase, and if appropriate, instruction on how to dive in and read the code:

