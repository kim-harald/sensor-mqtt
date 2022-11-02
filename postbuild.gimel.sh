rm -f ./dist/db/readings.jsondb
rm /home/kim/gimel/home/pi/apps/sensor/config/*
cp ./dist/. /home/kim/gimel/home/pi/apps/sensor/ -r
cp ./src/config/default.gimel.json /home/kim/gimel/home/pi/apps/sensor/config/default.json
rm /home/kim/gimel/home/pi/apps/sensor/config/default.gimel.json
rm /home/kim/gimel/home/pi/apps/sensor/config/default.zayin.json
cp ./sensor.service /home/kim/gimel/home/pi/apps/sensor