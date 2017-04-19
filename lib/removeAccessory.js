module.exports = removeAccessory

// Sample function to show how developer can remove accessory
// dynamically from outside event
function removeAccessory () {
	this.log('Remove Accessory')
	this.api.unregisterPlatformAccessories(
		'homebridge-tellstick',
		'TelldusTellstick',
		this.accessories
	)

	this.accessories = []
}
