# Shell script for starting docker containers for both frontend and backend

echo STARTING BACKEND
docker build -t backend ./server
# docker run -it --rm backend
docker run -it --rm -p 3000:3000 backend    # note: first 3000 is port on host machine (maybe macbook or windows), sec