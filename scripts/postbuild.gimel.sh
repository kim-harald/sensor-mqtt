ssh pi@gimel <<'ENDSSH'
    cd /home/pi/apps/sensor
    echo "Removing old files"
    find ./ -name '*' | grep -Ev 'log|db' | xargs rm -rf
    echo "Files removed"
ENDSSH
wait
rm ./dist/config/default.*.json -f
cp ./dist/. /mnt/net/gimel/home/pi/apps/sensor/ -r
cp ./sensor.service /mnt/net/gimel/home/pi/apps/sensor
cp ./src/config/default.gimel.json /mnt/net/gimel/home/pi/apps/sensor/config/default.json
echo "Copied files"
wait
ssh pi@gimel << 'ENDSSH'
cd /home/pi/apps/sensor
npm i --omit=dev
sudo service sensor stop
sudo cp /home/pi/apps/sensor/sensor.service /etc/systemd/system/sensor.service
sudo systemctl daemon-reload
sudo service sensor start
ENDSSH