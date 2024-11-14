# Run nodemon and sass --watch in parallel
Start-Process -NoNewWindow -FilePath "npx" -ArgumentList "cross-env NODE_ENV=development nodemon --env-file .env app/backend/server.js -L -e js,mjs,html,ejs,css,scss,toml"
Start-Process -NoNewWindow -FilePath "npx" -ArgumentList "sass --watch app/frontend/scss/styles.scss:app/frontend/css/styles.css"
