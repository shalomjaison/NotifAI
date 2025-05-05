# Data Baes
# 3/1/2025 
# Dockerfile is like shell script, here used for starting docker containers for frontend
# NOTE: need Docker daemon running, can be done by having Docker Desktop app running

# docker network create notifai-network   # might cause error that network already created

echo STARTING FRONTEND

# NOTE: Dockerfile needs this file in same directory
cp .env ./client

docker build -t notifai-client ./client

# note: first 9500 is port on host machine (maybe macbook or windows), 
# second 9500 is virtual port on Docker container, they map to each other
# docker run -it --rm --network notifai-network -p 9500:9500 notifai-client
docker run -it --rm -p 9500:9500 notifai-client