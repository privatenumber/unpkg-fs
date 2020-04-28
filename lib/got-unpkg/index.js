const got = require('got');
const parseUnpkgUrl = require('../util/parse-unpkg-url');
const stat = require('./stat');

const semver = new Map();

const gotUnpkg = got.extend({
	prefixUrl: 'https://unpkg.com',
	cache: new Map(),
	timeout: 5000,
	hooks: {
		beforeRequest: [
			(req) => {
				const reqUrlParsed = parseUnpkgUrl(req.url);
				req.reqUrlParsed = reqUrlParsed;

				if (semver.has(reqUrlParsed.pkgName)) {
					const version = semver.get(reqUrlParsed.pkgName).get(reqUrlParsed.version);

					if (version) {
						reqUrlParsed.version = version;
						req.url.pathname = reqUrlParsed.toString();
					}
				}
			}
		],

		afterResponse: [
			(res) => {
				res.stat = stat;

				const { reqUrlParsed } = res.request.options;
				const resUrlParsed = parseUnpkgUrl(new URL(res.url));
				res.resUrlParsed = resUrlParsed;

				let moduleSemver = semver.get(resUrlParsed.pkgName);
				if (!moduleSemver) {
					moduleSemver = semver.set(resUrlParsed.pkgName, new Map());
				}
				moduleSemver.set(reqUrlParsed.version, resUrlParsed.version);

				return res;
			},
		],
	},
});


module.exports = gotUnpkg;
