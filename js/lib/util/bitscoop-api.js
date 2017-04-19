'use strict';

const path = require('path');

const httpErrors = require('http-errors');

const callApi = require('./call-api');


class BitscoopAPI {
	constructor(config) {
		let self = this;

		config = config || {};

		self.token = config.token;
	}

	getMaps() {
		let self = this;

		return new Promise(function(resolve, reject) {
			callApi({
				method: 'GET',
				path: 'maps',
				headers: {
					Authorization: 'Bearer ' + self.token
				},
				query: {
					limit: 100
				}
			}, function(err, response, body) {
				if (err) {
					reject(err || httpErrors(404, err.message));
				}
				else if (response.statusCode !== 200) {
					reject(httpErrors(response.statusCode, body.message));
				}
				else {
					resolve(body);
				}
			});
		});
	}

	callEndpoint(options = {}) {
		if (!options.headers) {
			options.headers = {};
		}

		options.headers.Authorization = 'Bearer ' + this.token;

		return new Promise(function(resolve, reject) {
			callApi({
				method: options.method || 'GET',
				path: path.join(options.id, options.endpoint),
				hostname: 'data.api.bitscoop.com',
				headers: options.headers,
				query: options.query,
				body: options.body
			}, function(err, response, body) {
				if (err) {
					reject(err || httpErrors(404, err.message));
				}
				else if (response.statusCode !== 200) {
					reject(httpErrors(response.statusCode, body.message));
				}
				else {
					resolve(body);
				}
			});
		});
	}
}

module.exports = BitscoopAPI;
