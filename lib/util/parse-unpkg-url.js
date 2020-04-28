class UNPKG_URL {
	static pattern = /^\/(?<browse>browse\/)?(?<pkgName>(@[^\/]+\/)?[^\/@]+)(@(?<version>[^\/]+))?(?<filePath>.*)/;

	constructor(pathname) {
		Object.assign(this, pathname.match(UNPKG_URL.pattern).groups);
		this.browse = !!this.browse;
	}

	get pkgId() {
		const { pkgName, version } = this;
		return `${pkgName}${version ? `@${version}` : ''}`;
	}

	toString() {
		return `/${this.browse ? 'browse/' : ''}${this.pkgId}${this.filePath}`;
	}
}

module.exports = ({ pathname }) => new UNPKG_URL(pathname);
