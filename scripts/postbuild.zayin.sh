rm /mnt/net/zayin/home/pi/apps/sensor/config/*
cp ./dist/. /mnt/net/zayin/home/pi/apps/sensor/ -r
cp ./src/config/default.zayin.json /mnt/net/zayin/home/pi/apps/sensor/config/default.json
rm /mnt/net/zayin/home/pi/apps/sensor/config/default.*.json -f
cp ./sensor.service /mnt/net/zayin/home/pi/apps/sensor