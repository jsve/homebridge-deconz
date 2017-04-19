## Hardware
I'm using a Raspberry Pi running standard raspbian. To talk to zigbee devices such as Philips Hue and IKEA Trådfri I'm using this USB stick:

https://www.dresden-elektronik.de/conbee/

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

## Starting deCONZ
The software can be started either from the "Programming -> deCONZ" on the raspberry, or through

```
deCONZ --auto-connect=1 --http-port=8089
```

in the terminal (must be running in terminal window or on vnc, not SSH)

making autoconnect work:
https://raspberry.tips/hausautomatisierung/raspberry-pi-lichsteuerung/

Like the link says, run this:

```
mkdir ~/.config/autostart
sudo nano ~/.config/autostart/deCONZ.desktop
```

Then we add these lines:
```
[Desktop Entry]
Type=Application
Exec=deCONZ-autostart.sh
```

The autostart script needs to be changed to add the port-selection flag. We can do this with a nifty sed command:
```
sudo sed -ie 's/OPTIONS="--auto-connect=1 --dbg-error=1"/OPTIONS="--auto-connect=1 --http-port=8089 --dbg-error=1"/' /usr/bin/deCONZ-autostart.sh
```

### TL;DR
We can do the above in one go with:
```
mkdir ~/.config/autostart
sudo echo $'[Desktop Entry]\nType=Application\nExec=deCONZ-autostart.sh' > ~/.config/autostart/deCONZ.desktop
sudo sed -ie 's/OPTIONS="--auto-connect=1 --dbg-error=1"/OPTIONS="--auto-connect=1 --http-port=8089 --dbg-error=1"/' /usr/bin/deCONZ-autostart.sh
```


## Finding and signing on to the gateway's web-interface
Using

http://www.dresden-elektronik.de/discover/

It is simle to find the Pi and the proper port to use. Standard user and password is "delight". This can, and should, be changed in the settings, once signed on.


## Adding devices
You need to open the gateway to be able to add new devices (lights). This is possible through the web-interface as well as through the ordinary GUI. The device needs to be really close to the usb-stick to be added. 

I've had different experiences when trying to add devices. Sometimes I need to access the GUI on the raspberry (VNC or connected monitor) and make some commands to the unit before it shows up in the web-interface.

Once added, I've been using the web-interface to add the device to the proper group.



## Documentation

### deCONZ program
For some reason this seems to add alot of valuable information

https://www.dresden-elektronik.de/fileadmin/Downloads/Dokumente/Produkte/ZLL/RaspBee-BHB-en.pdf

#### Magic flags that have no documentation
--dbg-<type>=<level> (as described: https://github.com/dresden-elektronik/deconz-rest-plugin/issues/5)

### REST API
The API from Dresden elektronik is described in

http://dresden-elektronik.github.io/deconz-rest-doc/

Code here:

https://github.com/dresden-elektronik/deconz-rest-plugin/blob/b8393233a76fadf28a796f626c3aef428fbd4a47/de_web_plugin.cpp


### deCONZ API (C++)
https://www.dresden-elektronik.de/fileadmin/Downloads/Dokumente/Produkte/6_Software/deconz-cpp-doc/d8/d50/dbg__trace_8h_source.html

### Other plugins
There are not many, but this: https://hcm-lab.de/git/project/deconz-push/tree/master Seems to give listeners to deCONZ. Doesn't work with remotes, as far as I can see though.
