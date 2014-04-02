var Hapi = require('hapi');
var Mongoose = require('mongoose');

var Util = require('util');
var Utils = require('../../utils');
var Notifications = require('../notifications');
var Team = Mongoose.model('Team');
var Round = Mongoose.model('Round');
var Order = Mongoose.model('Order');


var User = Mongoose.model('User');

module.exports = function(server, config) {

    var routes = {};

    var getAllRounds = function(request, reply) {
        var limit = Utils.setLimit(request);
        var skip = Utils.setSkip(request);

        var user = request.auth.credentials;
        var query = {'members._id': user._id};
        
        var status = request.query.status || {$in: ['open', 'closed']} ;
        if(status) {
            query.status = status;
        }

        Round.find(query).skip(skip).limit(limit + 1).exec(function(err, rounds) {
            if(err) {
                return reply(err);
            }

            if(!rounds) {
                return reply(Hapi.error.notFound("This round does not exist"));
            }

            var data = {};
            data['hasMore'] = rounds.length === limit + 1;
            data['records'] = rounds.slice(0, limit);

            return reply(data);
        });
    };

    routes.getAllRounds = {
        auth: { strategies: ['hawk'] },
        handler: getAllRounds,
        validate: {
            query: {
                limit: Hapi.types.number().integer().min(1).max(process.env.PAGINATE_LIMIT),
                skip: Hapi.types.number().integer().min(1),
                status: Hapi.types.string().valid(['open', 'closed'])
            }
        }
    };

    return routes;

};