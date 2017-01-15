## Hardware
I'm using a raspberry pi running standard raspbian. To talk to zigbee devices such as Philips Hue and IKEA Trådfri I'm using this USB stick:

https://www.dresden-elektronik.de/conbee/


## Documentation
The API from Dresden elektronik is described in

http://dresden-elektronik.github.io/deconz-rest-doc/

## Installing and configuring deconz

Run:
```
wget http://www.dresden-elektronik.de/rpi/deconz/deconz-latest.deb
sudo dpkg -i deconz-latest.deb
```

These might not be nessesary, try without first:
```
wget http://www.dresden-elektronik.de/rpi/deconz-dev/deconz-dev-latest.deb
sudo dpkg -i deconz-dev-latest.deb
``