module.exports = configureAccessory

// Function invoked when homebridge tries to restore
// cached accessory
// This is done for all cached accessories before
// 'didFinishLaunching' is emitted.
// Possibly at other times aswell.
// Developer can configure accessory
// at here (like setup event handler)
// Update current value

// TelldusTellstickPlatform.prototype.configureAccessory
function configureAccessory (accessory) {
	this.log('Configure Accessory: ', accessory.displayName)
	var platform = this

	// Accessory must be created from
	// PlatformAccessory Constructor
	var Accessory = platform.api.platformAccessory

	// Service and Characteristic are from hap-nodejs
	var Service = platform.api.hap.Service
	var UUIDGen = platform.api.hap.uuid
	var Characteristic = platform.api.hap.Characteristic

	// set the accessory to reachable if plugin can
	// currently process the accessory
	// otherwise set to false and update the reachability
	// later by invoking accessory.updateReachability()
	accessory.reachable = true
	// platform.log(accessory)
	//accessory.context.persisted = 'yes'

	accessory.on('identify', function (paired, callback) {
		platform.log(accessory.displayName, 'Identify!!!')
		callback()
	})

	if (accessory.getService(Service.Lightbulb)) {
		accessory
			.getService(Service.Lightbulb)
			.getCharacteristic(Characteristic.On)
			.on('set', function (value, callback) {
				platform.log(accessory.displayName, 'Light -> ' + value)
				callback()
			})
	}

	this.accessories.push(accessory)
}
