const assert = require('assert');
const gotUnpkg = require('./got-unpkg');
const parseFsPath = require('./util/parse-fs-path');
const getVersion = require('./util/get-version');
const { isDirectory } = require('./util/stat-results');

class UnpkgFs {
	constructor(moduleName) {
		this.moduleName = moduleName;
	}

	getPkg() {
		if (this._pkg) {
			return this._pkg;
		}

		return new Promise((resolve, reject) => {
			this.readFile('/package.json', (err, result) => {
				if (err) {
					return reject(err);
				}

				this._pkg = JSON.parse(result);
				resolve(this._pkg);
			});
		});
	}

	readlink(reqPath, cb) {
		cb(new Error());
	}

	$readFile(reqPath) {
		return new Promise((res, rej) => 
			this.readFile(reqPath, (err, result) => err ? rej(err) : res(result))
		);
	}

	readFile(reqPath, cb) {
		assert(reqPath, 'path is required');
		(async () => {
			const parsedPath = parseFsPath(reqPath);

			if (parsedPath.nodeModules) {
				if (!parsedPath.version) {
					const version = getVersion(await this.getPkg(), parsedPath.pkgName);
					parsedPath.version = version;
				}

				return (new UnpkgFs(parsedPath.pkgId)).$readFile(parsedPath.filePath);
			}

			const res = await gotUnpkg(`${this.moduleName}${reqPath}`);
			return res.body;
		})().then(
			(result) => cb(!result ? new Error() : null, result),
			cb
		);
	}

	$stat(reqPath) {
		return new Promise((res, rej) => 
			this.stat(reqPath, (err, result) => err ? rej(err) : res(result))
		);
	}

	stat(reqPath, cb) {
		assert(reqPath, 'path is required');
		(async () => {
			const parsedPath = parseFsPath(reqPath);

			if (parsedPath.nodeModules && !parsedPath.filePath) {
				return isDirectory;
			}

			if (parsedPath.nodeModules) {
				if (!parsedPath.version) {
					const version = getVersion(await this.getPkg(), parsedPath.pkgName);
					parsedPath.version = version;
				}

				return (new UnpkgFs(parsedPath.pkgId)).$stat(parsedPath.filePath);
			}

			const res = await gotUnpkg(`${this.moduleName}${reqPath}`);
			return res.stat();
		})().then(
			(result) => cb(!result ? new Error() : null, result),
			cb
		);		
	}
}

module.exports = UnpkgFs;
