#!/bin/bash

# Set the Dockerfile name based on NODE_ENV
if [ "$NODE_ENV" == "production" ]; then
    export DOCKERFILE_NAME="Dockerfile.prod"
elif [ "$NODE_ENV" == "container" ]; then
    export DOCKERFILE_NAME="Dockerfile.dev"
else
    echo "No valid NODE_ENV set. Defaulting to development."
    export DOCKERFILE_NAME="Dockerfile.dev"
fi

# Run docker-compose with the selected Dockerfile and context
docker-compose up --build
