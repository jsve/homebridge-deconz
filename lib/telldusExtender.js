module.exports = function (telldus) {
	telldus.modelTranslator = {
		'switch': 'selflearning-switch',
		'remote': 'selflearning-switch',
		'dimmer': 'selflearning-dimmer',
		'bell': 'bell'
	}

	telldus.reverseModelTranslator = (telldusModel, callback) => {
		for (var configName in telldus.modelTranslator) {
			var telldusName = telldus.modelTranslator[configName]
			if (telldusModel.search(telldusName) >= 0) {
				callback(configName)
				return
			}
		}
	}

	var templateParameters = {
		'house': '',
		'unit': '',
		'code': ''
	}

	var templateDeviceData = {
		'name': '',
		'model': '',
		'config': {
			'telldusId': 0,
			'protocol': '',
			'parameters': JSON.parse(JSON.stringify(templateParameters))
		}
	}

	telldus.getDeviceParameters = (telldusId, callback) => {
		// not to be confused with the standard:
		// telldus.getDeviceParameter !
		var parameters = JSON.parse(JSON.stringify(templateParameters))

		// silly nested async stuff...
		telldus.getDeviceParameter(
			telldusId, 'house', '', function setHouseId (err, res) {
				if (err) {
					telldus.log(err)
					return false
				} else {
					parameters.house = res
					telldus.getDeviceParameter(
						telldusId, 'unit', '', function setUnitId (err, res) {
							if (err) {
								telldus.log(err)
								return false
							} else {
								parameters.unit = res
								telldus.getDeviceParameter(
									telldusId, 'code', '', function setCodeId (err, res) {
										if (err) {
											telldus.log(err)
											return false
										} else {
											if (
												(res === '') ||
												(res === '0000000000')
												) {
												res = false
											}
											parameters.code = res
											callback(parameters)
										}
									}
								)
							}
						}
					)
				}
			}
		)
	}

	telldus.getDeviceWithParameters = function (telldusDevice, callback) {
		if (telldusDevice.id) {
			telldus.getDeviceParameters(telldusDevice.id, (parameters) => {
				telldus.reverseModelTranslator(telldusDevice.model, (properModel) => {
					var devWithPars = JSON.parse(JSON.stringify(templateDeviceData))
					devWithPars.name = telldusDevice.name
					devWithPars.model = properModel
					devWithPars.config.telldusId = telldusDevice.id
					devWithPars.config.protocol = telldusDevice.protocol
					devWithPars.config.parameters = parameters
					callback(devWithPars)
				})
			})
		} else {
			return false
		}
	}

	telldus.getDevicesAndParameters = function (callback) {
		telldus.getDevices((err, devices) => {
			if (err) {
				telldus.log(err)
			} else {
				var devPars = []
				console.log('devparing')
				for (var device of devices) {
					telldus.getDeviceWithParameters(device, (devPar) => {
						// console.log(devPar)
						devPars.push(devPar)
						if (devices.length === devPars.length) {
							console.log('callbacking')
							callback(devPars)
						}
					})
				}

				//var devicesAndParameters = devices.map(telldus.getDeviceWithParameters)
				//callback(devicesAndParameters)
			}
		})
	// more telldus methods as desired...
	}
}
