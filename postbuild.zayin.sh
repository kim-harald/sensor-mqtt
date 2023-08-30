rm -f ./dist/db/readings.jsondb
rm /home/kim/zayin/home/pi/apps/sensor/config/*
cp ./dist/. /home/kim/zayin/home/pi/apps/sensor/ -r
cp ./src/config/default.zayin.json /home/kim/zayin/home/pi/apps/sensor/config/default.json
rm /home/kim/zayin/home/pi/apps/sensor/config/default.*.json -f
cp ./sensor.service /home/kim/zayin/home/pi/apps/sensor