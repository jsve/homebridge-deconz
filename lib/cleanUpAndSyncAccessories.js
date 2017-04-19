module.exports = cleanUpAndSyncAccessories

// Take the accessories from the config.json and make sure
// that they are the same as the ones that are cached and
// available through telldus.
// first: delete to reduce nr of accs to deal with
// then: for each row in config: check that parameters match
// cached and telldus accessories. If not: remove.
// last: add new accessories based on config. This makes sure
// that the missmatched ones are also added back in.
function cleanUpAndSyncAccessories () {
	var platform = this
	var configAccessories = platform.config.accessories || []
	var cachedAccessories = platform.accessories
	// var telldusAccessories = this.telldus.getDevicesSync()

	function matchingConfAccForTelldusDevice (confAcc, tellAcc) {
		if (!(tellAcc.config) || !(tellAcc.config.parameters)) {
			platform.log('device meta has no parameters to compare with')
			return false
		}
		if (!(confAcc.config) || !(confAcc.config.parameters)) {
			// its OK that confic accessory
			// has no config parameters.
			// just go to next.
			return false
		}
		if ((confAcc.model !== tellAcc.model) &&
			!((confAcc.model === 'remote') && (tellAcc.model === 'switch'))) {
			// TODO: check somewhere that
			// config.accessories has model and name!!
			//
			// and remotes are special...
			// telldus knows them as swiches
			return false
		}

		if (confAcc.config.protocol !== tellAcc.config.protocol) {
			return false
		}

		let tellParams = tellAcc.config.parameters
		let configParams = confAcc.config.parameters

		if (
			('house' in tellParams) &&
			('unit' in tellParams) &&
			('code' in tellParams) &&
			('house' in configParams) &&
			('unit' in configParams) &&
			('code' in configParams)
			) {
			if (
				(tellParams.house === configParams.house) &&
				(tellParams.unit === configParams.unit) &&
				(tellParams.code === configParams.code)
				) {
				return true
			} else {
				return false
			}
		} else {
			return false
		}
	}

	var removeStuff = () => {
		platform.log('Removing accessories that are not in config')
		var removeCachedAccessories = () => {
			platform.log('Removing cached accessories')
		}
		var removeTelldusAccessories = () => {
			var syncNameAndIdInTelldus = (confAcc, tellAcc) => {
				if (tellAcc.name !== confAcc.name) {
					console.log('name missmatch')
					platform.telldus.setName(
						tellAcc.config.telldusId,
						confAcc.name,
						(err) => {
							if (err) {
								platform.telldus.log(
									'Unable to change name on telldus device with id ' +
									tellAcc.config.telldusId)
								platform.telldus.log(tellAcc)
								platform.telldus.log('to:')
								platform.telldus.log(confAcc.name)
								platform.telldus.log('error was:')
								platform.telldus.log(err)
							}
						}
					)
				}
				if (tellAcc.config.telldusId !== confAcc.config.telldusId) {
					// update config with proper telldus id
				}
			}
			var updateOrRemoveTelldusDevice = (tellAcc) => {
				configAccessories.map((confAcc) => {
					if (matchingConfAccForTelldusDevice(confAcc, tellAcc)) {
						console.log('found match')
						syncNameAndIdInTelldus(confAcc, tellAcc)
						console.log('telldus: ', tellAcc)
						console.log(confAcc)
					} else {
						// console.log('no match for:')
						// console.log(confAcc)
					}
				})
			}

			platform.log('Removing Telldus accessories')
			platform.telldus.getDevicesSync().map(device => {
				platform.telldus.getDeviceWithParameters(
					device, updateOrRemoveTelldusDevice
				)
			})
		}
		removeCachedAccessories()
		removeTelldusAccessories()
	}

	this.log('Running cleanup')
	// this.log(configAccessories)
	// this.log(telldusAccessories)
	removeStuff()
	// this.config is the config.json
	// this.log is the platform log

	// Accessory must be created from
	// PlatformAccessory Constructor
	var Accessory = platform.api.platformAccessory

	// Service and Characteristic are from hap-nodejs
	var Service = platform.api.hap.Service
	var UUIDGen = platform.api.hap.uuid
	var Characteristic = platform.api.hap.Characteristic

	uuid = UUIDGen.generate('accessoryName')
}
