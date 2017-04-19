module.exports = homebridge => {
	console.log('homebridge API version: ' + homebridge.version)

	// For platform plugin to be considered as
	// dynamic platform plugin, then in:
	// registerPlatform(
	//							pluginName,
	// 						platformName,
	//							constructor,
	//							dynamic
	// )
	// dynamic must be true
	homebridge.registerPlatform(
		'homebridge-tellstick',
		'TelldusTellstick',
		TelldusTellstickPlatform,
		true
	)
}

class TelldusTellstickPlatform {
	constructor (log, config, api) {
		log('TelldusTellstick Init')
		var platform = this
		platform.log = log
		platform.config = config
		// platform.log(this)
		// platform.log(this.config)
		// platform.log(api.hap.Bridge)

		// container for all our accessories
		platform.accessories = []

		// require in all the homebridge-needed methods for the
		// platform-class
		// .bind(platform) means that "this" in the required file
		// will be this (TelldusTellstick) platform.
		// see this:
		// http://stackoverflow.com/questions/32699889/
		// es6-declare-a-prototype-method-on-a-
		// class-with-an-import-statement
		platform.configureAccessory = require(
			'./lib/configureAccessory').bind(platform)
		platform.configurationRequestHandler = require(
			'./lib/configurationRequestHandler').bind(platform)
		platform.addAccessory = require(
			'./lib/addAccessory').bind(platform)
		platform.updateAccessoriesReachability = require(
			'./lib/updateAccessoriesReachability').bind(platform)

		// the cleanup-function bound to the platform to be
		// able to be called from everywhere (like the gui).
		// the config.json is king. it overwites the telldus data
		platform.cleanUpAndSyncAccessories = require(
			'./lib/cleanUpAndSyncAccessories').bind(platform)

		// place telldus on the platform for convenience. Also to
		// be able to extend it with methods we need.
		// extending structure from: http://stackoverflow.com/
		// questions/38124639/how-do-i-split-a-class-definition-
		// across-multiple-files-in-node-js
		platform.telldus = require('telldus')
		require('./lib/telldusExtender')(platform.telldus)
		// telldus gets its own logger-prefix
		platform.telldus.log = string => log(`[rawTelldus]: ${string}`)

		if (api) { // not sure why api would not exist...
			// Save the API object as plugin needs to register
			// new accessory via this object.
			platform.api = api

			platform.api.on(
				'kalleballe',
				(input) => {
					console.log(input)
				})
			platform.api.emit('kalleballe', 'someInfo')

			// Listen to event 'didFinishLaunching', this means
			// homebridge already finished loading cached
			// accessories Platform Plugin should only
			// register new accessory that doesn't exist
			// in homebridge after this event.
			// Or start discover new accessories
			platform.api.on(
				'didFinishLaunching',
				function () {
					// mind that "this" here is the api!

					// When this is called, all cached accessories are
					// already platform.configureAccessory()-ed
					platform.cleanUpAndSyncAccessories()
					//platform.log('getting parameters')
					//platform.telldus.getDevicesAndParameters(devsAndPars => {
					//	console.log(devsAndPars)
					//})

					// platform.log(api.user.configPath())
					// platform.log(platform.accessories)
					// platform.log(platform.api.hap.uuid.generate('kalle'))
					// this.log(api.user.cachedAccessoryPath())
					platform.log('DidFinishLaunching')
				}
			)
		}
	}
}
