'use strict';

const https = require('https');
const url = require('url');

const _ = require('lodash');
const request = require('request');


let agent = new https.Agent({
	//ca: fs.readFileSync(path.join(process.cwd(), 'pki', 'root-ca.crt'))
	rejectUnauthorized: false
});


module.exports = function(options, cb) {
	options = options || {};

	let urlParts = {
		protocol: 'https',
		hostname: 'api.bitscoop.com'
	};

	if (options.hostname) {
		urlParts.hostname = options.hostname;
	}

	if (options.path) {
		urlParts.pathname = options.path;
	}

	if (options.query) {
		urlParts.query = options.query;
	}

	let requestOptions = {
		uri: url.format(urlParts),
		method: options.method || 'GET',
		headers: options.headers
	};

	if (options.body) {
		requestOptions.body = JSON.stringify(options.body);
		if (!requestOptions.headers.hasOwnProperty('Content-Type')) {
			requestOptions.headers['Content-Type'] = 'application/json';
		}
	}

	if (urlParts.protocol === 'https') {
		requestOptions.agent = agent;
	}

	return request(requestOptions, function(err, response, body) {
		let contentType = _.get(response, 'headers[\'content-type\']', null);

		if (contentType && /application\/json/.test(contentType)) {
			body = JSON.parse(body);
		}

		cb(err, response, body);
	});
};
