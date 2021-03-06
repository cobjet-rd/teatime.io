var Rounds = require('../../lib/rounds');

exports.register = function(server, options, next) {
    var rounds = new Rounds(server);
    server.bind(rounds);

	server.route([
		{ method: 'GET', path: '/rounds', config: rounds.getAllRounds }
	]);
};

exports.register.attributes = {
    pkg: require('./package.json')
};