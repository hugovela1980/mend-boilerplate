#!/bin/bash
cross-env NODE_ENV=development nodemon --env-file .env app/backend/server.js -L -e js,mjs,html,ejs,css,toml &
sass --watch app/frontend/scss/styles.scss:app/frontend/css/styles.css
