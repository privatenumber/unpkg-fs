const assert = require('assert');

function getVersion(pkg, moduleName) {
	const depType = ['dependencies', 'devDependencies', 'peerDependencies'].find(d => pkg[d] && pkg[d][moduleName]);
	assert(depType, `Undeclared dependency "${moduleName}"`);
	return pkg[depType][moduleName];
}

module.exports = getVersion;
