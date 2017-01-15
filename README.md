## Hardware
I'm using a Raspberry Pi running standard raspbian. To talk to zigbee devices such as Philips Hue and IKEA Trådfri I'm using this USB stick:

https://www.dresden-elektronik.de/conbee/

## Finding and signing on to the gateway's web-interface
Using

http://www.dresden-elektronik.de/discover/

It is simle to find the Pi and the proper port to use. Standard user and password is "delight". This can, and should, be changed in the settings, once signed on.


## Adding devices
You need to open the gateway to be able to add new devices (lights). This is possible through the web-interface as well as through the ordinary GUI. The device needs to be really close to the usb-stick to be added. 

I've had different experiences when trying to add devices. Sometimes I need to access the GUI on the raspberry (VNC or connected monitor) and make some commands to the unit before it shows up in the web-interface.

Once added, I've been using the web-interface to add the device to the proper group.


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