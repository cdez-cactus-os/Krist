var utils       = require('./utils.js'),
	config      = require('./../config.js'),
	schemas     = require('./schemas.js'),
	webhooks    = require('./webhooks.js'),
	krist       = require('./krist.js');

function Names() {}

Names.getNames = function(limit, offset) {
	return schemas.name.findAll({order: 'name', limit: typeof limit !== 'undefined' ? parseInt(limit) : null, offset: typeof offset !== 'undefined' ? parseInt(offset) : null});
};

Names.getNamesByOwner = function(owner) {
	return schemas.name.findAll({order: 'name', where: {owner: owner}});
};

Names.getNameCountByOwner = function(owner) {
	return schemas.name.count({where: {owner: owner}});
};

Names.getNameByName = function(name) {
	return schemas.name.findOne({where: {name: name}});
};

Names.getUnpaidNames = function() {
	return schemas.name.findAll({order: 'id DESC', where: {unpaid: {$gt: 0}}});
};

Names.getUnpaidNameCount = function() {
	return schemas.name.count({where: {unpaid: {$gt: 0}}});
};

Names.getNameCost = function() {
	return config.name_cost;
};

Names.createName = function(name, owner) {
	return schemas.name.create({
		name: name,
		owner: owner,
		registered: new Date(),
		updated: new Date(),
		unpaid: Names.getNameCost()
	}).then(function(name) {
		webhooks.callNameWebhooks(name);
	});
};

module.exports = Names;