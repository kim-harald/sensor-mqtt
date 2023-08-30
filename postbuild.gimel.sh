rm -f ./dist/db/readings.jsondb
rm -f /home/kim/gimel/home/pi/apps/sensor/config/*
cp ./dist/. /home/kim/gimel/home/pi/apps/sensor/ -r
cp ./src/config/default.gimel.json /home/kim/gimel/home/pi/apps/sensor/config/default.json
rm /home/kim/gimel/home/pi/apps/sensor/config/default.gimel.json
rm /home/kim/gimel/home/pi/apps/sensor/config/default.zayin.json
rm /home/kim/gimel/home/pi/apps/sensor/config/default.dalet.json
cp ./sensor.service /home/kim/gimel/home/pi/apps/sensor