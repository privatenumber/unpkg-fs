const UnpkgFs = require('..');
const { AssertionError } = require('assert');


describe('readFile', () => {
	test('fetch package.json', (cb) => {
		const fs = new UnpkgFs('vue@2.6.11');
		fs.readFile('/package.json', (err, str) => {
			expect(err).toBe(null);
			expect(str.length).toBeGreaterThan(10);
			expect(() => JSON.parse(str)).not.toThrow();
			cb();
		});
	});

	test('fetch file', (cb) => {
		const fs = new UnpkgFs('vue@2.6.11');
		fs.readFile('/dist/vue.js', (err, str) => {
			expect(err).toBe(null);
			expect(str.length).toBeGreaterThan(10);
			cb();
		});
	});

	test('error on undeclared dependency', (cb) => {
		const fs = new UnpkgFs('vue@2.6.11');
		fs.readFile('/node_modules/react/index.js', (err, str) => {
			expect(err).toBeInstanceOf(AssertionError);
			expect(str).toBe(undefined);
			cb();
		});
	});

	test('fetch dependency', (cb) => {
		const fs = new UnpkgFs('vue@2.6.11');

		// Should read version from vue@2.6.11/package.json
		fs.readFile('/node_modules/lodash/package.json', (err, str) => {
			expect(err).toBe(null);
			expect(str.length).toBeGreaterThan(10);
			expect(() => JSON.parse(str)).not.toThrow();
			cb();
		});
	});

	test('fetch nested dependency', (cb) => {
		const fs = new UnpkgFs('vue@2.6.11');

		// Should read version from vue@2.6.11/package.json -> strip-indent@version/package.json
		fs.readFile('/node_modules/yorkie/node_modules/strip-indent/package.json', (err, str) => {
			expect(err).toBe(null);
			expect(str.length).toBeGreaterThan(10);
			expect(() => JSON.parse(str)).not.toThrow();
			cb();
		});
	});

	test('org dependency', (cb) => {
		const fs = new UnpkgFs('@babel/core@7.9.0');
		fs.readFile('/node_modules/@babel/code-frame/lib/index.js', (err, str) => {
			expect(err).toBe(null);
			expect(str.length).toBeGreaterThan(10);
			cb();
		});
	});

	test('org dependency package.json', (cb) => {
		const fs = new UnpkgFs('@babel/core@7.9.0');
		fs.readFile('/node_modules/@babel/code-frame/package.json', (err, str) => {
			expect(err).toBe(null);
			expect(str.length).toBeGreaterThan(10);
			expect(() => JSON.parse(str)).not.toThrow();
			cb();
		});
	});

	test('org nested dependency', (cb) => {
		const fs = new UnpkgFs('@babel/core@7.9.0');
		fs.readFile('/node_modules/@babel/types/node_modules/@babel/generator/package.json', (err, str) => {
			expect(err).toBe(null);
			expect(str.length).toBeGreaterThan(10);
			expect(() => JSON.parse(str)).not.toThrow();
			cb();
		});
	});

});

describe('stat', () => {

	test('package file', (cb) => {
		const fs = new UnpkgFs('vue@2.6.11');
		fs.stat('/package.json', (err, stat) => {
			expect(err).toBe(null);
			expect(stat.isFile()).toBe(true);
			cb();
		});
	});

	test('package directory', (cb) => {
		const fs = new UnpkgFs('vue@2.6.11');
		fs.stat('/dist/', (err, stat) => {
			expect(err).toBe(null);
			expect(stat.isDirectory()).toBe(true);
			cb();
		});
	});

	test('no extension', (cb) => {
		const fs = new UnpkgFs('vue@2.6.11');
		fs.stat('/dist/vue.min', (err, stat) => {
			expect(err).toBe(null);
			expect(stat.isFile()).toBe(true);
			cb();
		});
	});

	test('node_modules', (cb) => {
		const fs = new UnpkgFs('vue@2.6.11');
		fs.stat('/node_modules', (err, stat) => {
			expect(err).toBe(null);
			expect(stat.isDirectory()).toBe(true);
			cb();
		});
	});

	test('dependency', (cb) => {
		const fs = new UnpkgFs('vue@2.6.11');
		fs.stat('/node_modules/lodash', (err, stat) => {
			expect(err).toBe(null);
			expect(stat.isDirectory()).toBe(true);
			cb();
		});
	});

	test('dependency package.json', (cb) => {
		const fs = new UnpkgFs('vue@2.6.11');
		fs.stat('/node_modules/lodash/package.json', (err, stat) => {
			expect(err).toBe(null);
			expect(stat.isFile()).toBe(true);
			cb();
		});
	});

	test('nested dependency', (cb) => {
		const fs = new UnpkgFs('vue@2.6.11');
		fs.stat('/node_modules/yorkie/node_modules/strip-indent/package.json', (err, stat) => {
			expect(err).toBe(null);
			expect(stat.isFile()).toBe(true);
			cb();
		});
	});

	test('with version', (cb) => {
		const fs = new UnpkgFs('vue@2.6.11');
		fs.stat('/node_modules/process@^0.11.10', (err, stat) => {
			expect(err).toBe(null);
			expect(stat.isDirectory()).toBe(true);
			cb();
		});
	});

	test('org dependency', (cb) => {
		const fs = new UnpkgFs('@babel/core@7.9.0');
		fs.stat('/node_modules/@babel/code-frame', (err, stat) => {
			expect(err).toBe(null);
			expect(stat.isDirectory()).toBe(true);
			cb();
		});
	});

	test('org dependency package.json', (cb) => {
		const fs = new UnpkgFs('@babel/core@7.9.0');
		fs.stat('/node_modules/@babel/code-frame/package.json', (err, stat) => {
			expect(err).toBe(null);
			expect(stat.isFile()).toBe(true);
			cb();
		});
	});

	test('org nested dependency', (cb) => {
		const fs = new UnpkgFs('@babel/core@7.9.0');
		fs.stat('/node_modules/@babel/types/node_modules/@babel/generator/package.json', (err, stat) => {
			expect(err).toBe(null);
			expect(stat.isFile()).toBe(true);
			cb();
		});
	});

	test('undeclared dependency', (cb) => {
		const fs = new UnpkgFs('@babel/core@7.9.0');
		fs.stat('/node_modules/@babel/types/node_modules/buffer@4.9.2/index.js', (err, stat) => {
			expect(err).toBe(null);
			expect(stat.isFile()).toBe(true);
			cb();
		});
	});
});
