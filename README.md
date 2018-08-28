cf 12: Express Middleware
Submission Instructions
Work in a fork of this repository
Work in a branch on your fork
Create a PR to your master from your working branch.
Ensure that your repository/branch is connected to travis-ci.com
Ensure that your repository/branch is connected to a dyno at heroku.com
Heroku and Travis should pick you up and deploy
Submit on canvas:
a question and observation
how long you spent
link to your pull request
link to your build at travis-ci URL
Heroku Server URL
Configuration
Configure the root of your repository with the following files and directories. Thoughfully name and organize any aditional configuration or module files.

README.md - contains documentation
.env - contains env variables (should be git ignored)
.gitignore - contains a robust .gitignore file
.eslintrc - contains the course linter configuratoin
.eslintignore - contains the course linter ignore configuration
.travis.yml - contains the course linter ignore configuration
package.json - contains npm package config
create a lint script for running eslint (eslint **/*.js)
create a test script for running tests
create a start script for running your server
index.js - the entry point for your application
src/ - contains your core application files and folders
src/app.js - (or main.js) contains your core application bootstrap
src/lib/ - contains module definitions
__test__/ - contains unit tests
Learning Objectives
students will be able to work with application, router, and 3rd party middleware through the use of express.js
students will be able to implement custom middleware through the use of express.js
students will be able to create custom routers for a specific resource
students will be able to leverage 3rd party helper modules for debugging, logging, and handling errors
Feature Tasks
use the npm debug module to log the methods in your application
create an npm script to automate the debug process and start the server
Don't forget to set DEBUG in your .env!
create a single resource express API that can handle GET, POST, and PUT requests
Choose your own resource, as long as it's not Note or Person
create an error-middleware module to handle errors and use it in your server file
create a model module to handle dynamic models and use it in your server file
create methods for filesystem and memory modules to handle GET, POST, and PUT operations.
create a series of acceptance tests to test your GET, POST, and PUT routes
hint: you'll want to use the before and after hooks provided by jest in order to create a test note and delete the note after the test has completed