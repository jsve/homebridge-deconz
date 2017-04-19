module.exports = configurationRequestHandler

// Handler will be invoked when user try to config your plugin
// Callback can be cached and invoke when nessary
function configurationRequestHandler (
	context,
	request,
	callback
) {
	this.log('Context: ', JSON.stringify(context))
	this.log('Request: ', JSON.stringify(request))

	// Check the request response
	if (
		request &&
		request.response &&
		request.response.inputs &&
		request.response.inputs.name
	) {
		this.log('done enough stuff to be considered done')
		//this.addAccessory(request.response.inputs.name)

		// Invoke callback with config will let homebridge
		// save the new config into config.json
		// Callback = function(
		// 						response,
		//						type,
		//						replace,
		//						config)
		// set 'type' to 'platform' if the plugin is trying
		// to modify platforms section
		// 'type' can also be 'accessory' if modifying
		// Accessories section (in root of config.json)
		//
		// if config is passed, response is ignored. That means
		// that after changing config,
		// the main menu is allways shown
		// set 'replace' to true will let homebridge
		// replace existing config in config.json
		// if 'replace' is false, the config will just
		// add a new object the supplied config
		// 'config' is the data platform trying to save
		// if supplied with just this.config (this being
		// the platform), nothing will change.
		//
		//
		// callback here is invoked from: https://github.com/
		// nfarina/homebridge/blob/
		// f17fe59590bfa0bee7fbb29c7a4e2885602a7f16/lib/
		// bridgeSetupSession.js#L80
		// this.config['accessories'] = ['a', 'b']

		callback(null, 'platform', true, this.config)
		return
	}

	// - UI Type: Input
	// Can be used to request input from user
	// User response can be retrieved from
	// request.response.inputs next time
	// when configurationRequestHandler being invoked

	var respDict = {
		type: 'Interface',
		interface: 'input',
		title: 'Add Accessory',
		items: [
			{
				id: 'name',
				title: 'Name',
				placeholder: 'Fancy Light'
			} // ,
			// {
			//   'id': 'pw',
			//   'title': 'Password',
			//   'secure': true
			// }
		]
	}

	// - UI Type: List
	// Can be used to ask user to select something from the list
	// User response can be retrieved from
	// request.response.selections next time
	// when configurationRequestHandler being invoked

	// var respDict = {
	// 'type': 'Interface',
	// 'interface': 'list',
	// 'title': 'Select Something',
	// 'allowMultipleSelection': true,
	// 'items': [
	// 'A','B','C'
	// ]
	// }

	// - UI Type: Instruction
	// Can be used to ask user to do something
	// (other than text input)
	// Hero image is base64 encoded image data.
	// Not really sure the maximum length HomeKit allows.

	// var respDict = {
	// 'type': 'Interface',
	// 'interface': 'instruction',
	// 'title': 'Almost There',
	// 'detail': 'Please press the button on
	// the bridge to finish the setup.',
	// 'heroImage': 'base64 image data',
	// 'showActivityIndicator': true,
	// 'showNextButton': true,
	// 'buttonText': 'Login in browser',
	// 'actionURL': 'https://google.com'
	// }

	// Plugin can set context to allow it track setup process
	context.ts = 'Hello'

	// invoke callback to update setup UI
	callback(respDict)
}
