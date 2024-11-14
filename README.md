# hello-world-containerized
## Description
This is a simple hello world application that is containerized using Docker.

## How to start...
### ...the local development environment
  `npm run local_dev` in the command line

### ...the development container environment
  `npm run dev_cont` in the command line

### ...the production container environment
  `npm run prod_cont` in the command line
  
## How it works
### Home Page
* Selecting the different dropdown menu options in the landing page will do the following actions:
  * World --> Will display a "Hello World" page.
  * Universe --> Will display a "Hello Universe" page.
  * TRACE --> Will make the server log a trace level log to the terminal.
  * DEBUG --> Will make the server log a debug level log to the terminal.
  * INFO --> Will make the server log an info level log to the terminal.
  * WARN --> Will make the server log a warn level log to the terminal and to the ***http.log*** file.
  * ERROR --> Will make the server log an error level log to the terminal and to the ***http.log*** file.
  * CUSTOM --> Will make the server log a custom level log to the terminal and to the ***http.log*** file.
  * FILE UPLOAD --> Navigate over to the File Upload page
* The server will only write ERROR, FATAL and CUSTOM level logs to a file called http.log inside of the logs folder.

### File Upload Page
* Upload, preview and delete files.