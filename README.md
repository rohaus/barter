Barter
======

Barter is an interface that connects you to your community and allows you to trade items with other users and share the story behind them.

Barter is currently available at http://barter-app.herokuapp.com

![main](http://i.imgur.com/fqESTsL.png)

# Contents

- [Usage](#usage)
- [Development](#development)
  - [Repo Organization](#repo-organization)
  - [Technology Used](#the-technology)
  - [Challenges](#challenges)
  - [Author](#author)

# Usage

Users sign in using their Facebook accounts to log in.

They can post items and use the map to browse through the posts.

![map](http://i.imgur.com/nnR4gEg.png)

The dashboard is used to keep track of trade requests, messages, and posts.

![dashbaord](http://i.imgur.com/7kRsfFr.png)

# Development

## Repo Organization

- app: server-side MVC
  - controllers: controllers for API endpoints
  - models: MongoDB schema
  - views: HTML bootstrapper
  -`utils.js`: contains utility functions used in multiple controllers
- config: middleware setup, API, other server settings
- public: client-side code
  - controllers: angular controllers
  - services: angular services
  - styles: css stylesheet, stylus files, and images
  - templates: angular views
  - `app.js`: angular bootstrapper and router
- test: server-side tests
- `server.js`: starts the server

## The Technology

### Tech Stack:

- **Angular.js**: client-side framework
- **Lodash**: utility library
- **Google Maps API**: map
- **Marker Clusterer**: clustering library for Google Maps
- **Overlapping Marker Spiderfier**: clustering library for Google Maps
- **Nodes.js**: service-side app platform
  - **Express.js**: server-side framework
- **Mongoose.js**: MongoDB ORM
- **Stylus**: CSS preprocessor
- **Jade**: template engine
- **Passport**: user authentication
  - **Passport-Facebook: facebook user authentication
- **Superagent**: light-weight progressive ajax API
- **Should**: client-side HTTP request library

### Dev Tools
- **git**: version control magician
- **npm**: package commander-in-chief for back-end libraries
- **Bower**: package commander-in-chief for front-end libraries
- **Heroku**: server

## Challenges

- Getting Google Maps to work efficiently with Angular was a significant issue. Connections between the two took some time because changes inside the map were not directly noticed by Angular; however, using $rootScope.$digest to update the views solved this issue.

- Another obstacle was to design for a fluid and intuitive user experience. This was accomplished by allowing instant search in the sidebar and by using two versions of clustering to simplify the geospatial search process.

## Author

[Ryan Roxas](https://github.com/rohaus)
