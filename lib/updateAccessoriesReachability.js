module.exports = updateAccessoriesReachability

function updateAccessoriesReachability () {
	this.log('Update Reachability')
	for (var index in this.accessories) {
		var accessory = this.accessories[index]
		accessory.updateReachability(false)
	}
}
