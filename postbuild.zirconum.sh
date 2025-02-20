rm /mnt/net/zirconum/home/pi/apps/sensor/config/*
cp ./dist/. /mnt/net/zirconum/home/pi/apps/sensor/ -r
cp ./src/config/default.zirconum.json /mnt/net/zirconum/home/pi/apps/sensor/config/default.json
rm /mnt/net/zirconum/home/pi/apps/sensor/config/default.*.json -f
cp ./sensor.service /mnt/net/zirconum/home/pi/apps/sensor