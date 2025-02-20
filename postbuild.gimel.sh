rm /mnt/net/gimel/home/pi/apps/sensor/config/*
cp ./dist/. /mnt/net/gimel/home/pi/apps/sensor/ -r
cp ./src/config/default.gimel.json /mnt/net/gimel/home/pi/apps/sensor/config/default.json
rm /mnt/net/gimel/home/pi/apps/sensor/config/default.gimel.json
rm /mnt/net/gimel/home/pi/apps/sensor/config/default.zayin.json
cp ./sensor.service /mnt/net/gimel/home/pi/apps/sensor