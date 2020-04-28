const { isFile, isDirectory } = require('../util/stat-results');

function stat() {
	if (this.statusCode === 404) {
		return null;
	}

	if (this.redirectUrls.length === 0) {
		return isFile;
	}

	const { reqUrlParsed } = this.request.options;
	const { resUrlParsed } = this;

	if (resUrlParsed.browse) {
		return isDirectory;
	}

	if (
		// Same file path, different semver
		reqUrlParsed.filePath === resUrlParsed.filePath

		// Same semver, resolved extension
		|| `${reqUrlParsed.filePath}.js` === resUrlParsed.filePath
	) {
		return isFile;
	}

	return isDirectory;
}

module.exports = stat;
