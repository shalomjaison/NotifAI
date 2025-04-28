# Quick shell script to start frontend app, uses webpack as defined in build and start commands in package.json

echo STARTING BACKEND APPLICATION

export BACKEND_USES_DOCKER=0

cp .env ./server

node ./server/server.js
