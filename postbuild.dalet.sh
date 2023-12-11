rm -f ./dist/db/readings.jsondb
rm /home/kim/dalet/home/pi/apps/sensor/config/*
cp ./dist/. /home/kim/dalet/home/pi/apps/sensor/ -r
cp ./src/config/default.dalet.json /home/kim/dalet/home/pi/apps/sensor/config/default.json
rm /home/kim/dalet/home/pi/apps/sensor/config/default.*.json -f
cp ./sensor.service /home/kim/dalet/home/pi/apps/sensor