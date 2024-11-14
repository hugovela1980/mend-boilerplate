# Set the Dockerfile name and context based on NODE_ENV
if ($env:NODE_ENV -eq "production") {
    $env:DOCKERFILE_NAME = "Dockerfile.prod"
} elseif ($env:NODE_ENV -eq "container") {
    $env:DOCKERFILE_NAME = "Dockerfile.dev"
} else {
    Write-Host "No valid NODE_ENV set. Defaulting to development."
    $env:DOCKERFILE_NAME = "Dockerfile.dev"
}

# Run docker-compose with the selected Dockerfile and context
docker-compose up --build
