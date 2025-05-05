# Data Baes
# 3/1/2025 
# Shell script for starting docker containers for backend
# NOTE: need Docker daemon running, can be done by having Docker Desktop app running

# docker network create notifai-network   # might cause error that network already created

echo STARTING BACKEND

# NOTE: Dockerfile needs theis file in same directory
cp .env ./server   

docker build -t notifai-server ./server
# docker run -it --rm backend

# note: first 3000 is port on host machine (maybe macbook or windows), second 3000 is virtual port on Docker container, they map to each other
# docker run -e USING_DOCKER=1 -it --rm --network notifai-network --ip=localhost -p 3000:3000 notifai-server
docker run -e USING_DOCKER=1 -it --rm -p 3000:3000 notifai-server