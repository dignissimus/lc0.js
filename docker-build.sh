docker build -t lc0js .
docker create --name lc0js lc0js
docker cp lc0js:/lc0.js/build/ .
docker rm lc0js
