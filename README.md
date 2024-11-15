# Node, Express, Mongodb and Docker Boilerplate

### How to open this app:
  - Copy and paste this docker run command in the terminal (it's a long one) to open the application in a Docker Container
      - `docker run -p 50:5000 --name mend-boilerplate-cont -e NODE_ENV=container -e DOCKERFILE_NAME=Dockerfile.dev -e HOST_PORT=50 -e CONT_PORT=5000 -e AWS_INSTANCE_IP=54.183.123.15 -e LOG_FILE_PATH=./app/backend/logs/http.log -e UPLOADS_DIR=./app/backend/uploads hugovela1980/node-express-mongodb-docker-boilerplate:1.0`