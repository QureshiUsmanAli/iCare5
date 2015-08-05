'use strict';

module.exports = function(app) {
	var domino	= require('../../app/controllers/domino.server.controller');
	
	app.route('/domino/:db/:lookup?/:nam?/:dat?')
		.get(domino.doStuff);	
};