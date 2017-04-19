'use strict';

const url = require('url');

const _ = require('lodash');
const httpErrors = require('http-errors');

const BitscoopAPI = require('./lib/util/bitscoop-api');


class BitScoopSDK {
	constructor(config) {
		let self = this;

		config = config || {};

		self.ids = new Set();
		self.maps = {};
		self.nameMap = {};

		self.api = new BitscoopAPI({
			token: config.token
		});

		self.ready = self.api.getMaps()
			.then(function(maps) {
				_.each(maps.results, function(map) {
					let id = map.id;

					self.ids.add(id);
					self.nameMap[map.name] = map.id;
				});

				return Promise.resolve();
			});
	}

	map(val) {
		let self = this;

		return {
			endpoint: function(endpointName) {
				return {
					method: function(method) {
						return function(options = {}) {
							return self.ready
								.then(function() {
									let id = self.nameMap.hasOwnProperty(val) ? self.nameMap[val] : val;

									if (!self.ids.has(id)) {
										return Promise.reject(new Error('No API map with that ID is available'));
									}

									return self.api.callEndpoint({
										id: id,
										endpoint: endpointName,
										method: method,
										query: options.query,
										headers: options.headers,
										body: options.body
									});
								})
								.catch(function(err) {
									return Promise.reject(new Error(err.message));
								})
						}
					}
				}
			}
		}
	}
}


module.exports = BitScoopSDK;
