class fsPath {
	static pathPtrn = /^(?<nodeModules>\/node_modules(?<pkgName>(\/@[^\/]+)?\/[^\/]+)?)?(?<filePath>.*)?$/;
	static pkgNamePtrn = /^(?<pkgName>(@[^\/]+\/(?=[^\/]+))?[^@\/]+)(@(?<version>[^\/]+))?$/;

	constructor(pathname) {
		const { groups: pathGroups } = pathname.match(fsPath.pathPtrn);
		this.nodeModules = !!pathGroups.nodeModules;
		this.filePath = pathGroups.filePath;

		if (pathGroups.pkgName) {
			const validPkgName = pathGroups.pkgName.slice(1).match(fsPath.pkgNamePtrn);
			if (validPkgName) {
				const { groups: pkgGroups } = validPkgName;
				this.pkgName = pkgGroups.pkgName;
				this.version = pkgGroups.version;
			}
		}
	}

	get pkgId() {
		if (!this.pkgName || !this.version) {
			return undefined;
		}
		return `${this.pkgName}@${this.version}`;
	}


	toString() {
		return `/${this.nodeModules ? 'node_modules/' : ''}${this.pkgId || this.pkgName}${this.filePath}`;
	}
}

module.exports = (pathname) => new fsPath(pathname);
