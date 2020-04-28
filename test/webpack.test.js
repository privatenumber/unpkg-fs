const webpack = require('webpack');
const { Volume } = require('memfs');
const UnpkgFs = require('..');

function build({ inputFs, entry }) {
	const compiler = webpack({
		mode: 'production',
		context: '/',
		entry,
		resolve: {
			extensions: [],
			alias: {
				assert: 'assert@^1.1.1',
				buffer: 'buffer@^4.3.0',
				events: 'events@^3.0.0',
				punycode: 'punycode@^1.2.4',
				stream: 'stream-browserify@^2.0.2',
				string_decoder: 'string_decoder@^1.0.0',
				url: 'url@^0.11.0',
				crypto: 'crypto-browserify@^3.11.0'
			}
		},
		output: {
			filename: 'index.js',
			path: '/'
		},
		optimization: {
			minimize: false,
		},
	});

	compiler.inputFileSystem = inputFs;
	compiler.outputFileSystem = new Volume();

	return new Promise((resolve, reject) => {
		compiler.run((err, stats) => {
			if (err) {
				return reject(err);
			}
			if (stats.hasErrors()) {
				return reject(stats.toJson().errors);
			}

			resolve(compiler.outputFileSystem.readFileSync('/index.js'));
		});
	});
}


describe('no deps', () => {
	test('is-buffer', async () => {
		const built = await build({
			inputFs: new UnpkgFs('is-buffer@2.0.4'),
			entry: '/index.js',
		});

		expect(built).toBeInstanceOf(Buffer);
		expect(built.toString().length).toBeGreaterThan(100);
	});

	test('vue', async () => {
		const built = await build({
			inputFs: new UnpkgFs('vue@2.6.11'),
			entry: '/dist/vue.js',
		});

		expect(built).toBeInstanceOf(Buffer);
		expect(built.toString().length).toBeGreaterThan(100);
	});
});

describe('internal deps', () => {
	test('lodash', async () => {
		const built = await build({
			inputFs: new UnpkgFs('lodash@4.17.15'),
			entry: '/camelCase.js',
		});

		expect(built).toBeInstanceOf(Buffer);
		expect(built.toString().length).toBeGreaterThan(100);
	}, 10000);
});

describe('multiple dependencies', () => {
	test('pretty-ms', async () => {
		const built = await build({
			inputFs: new UnpkgFs('pretty-ms@7.0.0'),
			entry: '/index.js',
		});

		expect(built).toBeInstanceOf(Buffer);
		expect(built.toString().length).toBeGreaterThan(100);
	}, 10000);

	test('@babel/code-frame', async () => {
		const built = await build({
			inputFs: new UnpkgFs('@babel/code-frame@7.8.3'),
			entry: '/lib/index.js',
		});

		expect(built).toBeInstanceOf(Buffer);
		expect(built.toString().length).toBeGreaterThan(100);
	}, 10000);

	test('randomfill', async () => {
		const built = await build({
			inputFs: new UnpkgFs('randomfill@1.0.3'),
			entry: '/browser.js',
		});

		expect(built).toBeInstanceOf(Buffer);
		expect(built.toString().length).toBeGreaterThan(100);
	}, 10000);

	test('safe-buffer', async () => {
		const built = await build({
			inputFs: new UnpkgFs('safe-buffer@5.2.0'),
			entry: '/index.js',
		});

		expect(built).toBeInstanceOf(Buffer);
		expect(built.toString().length).toBeGreaterThan(100);
	}, 10000);

	test('buffer', async () => {
		const built = await build({
			inputFs: new UnpkgFs('buffer@4.9.2'),
			entry: '/index.js',
		});

		expect(built).toBeInstanceOf(Buffer);
		expect(built.toString().length).toBeGreaterThan(100);
	}, 100000);

	test('stream-browserify', async () => {
		const built = await build({
			inputFs: new UnpkgFs('stream-browserify@2.0.1'),
			entry: '/index.js',
		});

		expect(built).toBeInstanceOf(Buffer);
		expect(built.toString().length).toBeGreaterThan(100);
	}, 100000);

	test('randombytes', async () => {
		const built = await build({
			inputFs: new UnpkgFs('randombytes@^2.0.5'),
			entry: '/browser.js',
		});

		expect(built).toBeInstanceOf(Buffer);
		expect(built.toString().length).toBeGreaterThan(100);
	}, 100000);

	test('create-hash', async () => {
		const built = await build({
			inputFs: new UnpkgFs('create-hash@1.1.0'),
			entry: '/browser.js',
		});

		expect(built).toBeInstanceOf(Buffer);
		expect(built.toString().length).toBeGreaterThan(100);
	}, 100000);

	test('create-hash@1.2.0', async () => {
		const built = await build({
			inputFs: new UnpkgFs('create-hash@1.2.0'),
			entry: '/browser.js',
		});

		expect(built).toBeInstanceOf(Buffer);
		expect(built.toString().length).toBeGreaterThan(100);
	}, 100000);






	// Anything dependent on crypto-browserify seems to break

	// test('brorand@1.1.0', async () => {
	// 	const built = await build({
	// 		inputFs: new UnpkgFs('brorand@1.1.0'),
	// 		entry: '/index.js',
	// 	});

	// 	expect(built).toBeInstanceOf(Buffer);
	// 	expect(built.toString().length).toBeGreaterThan(100);
	// }, 100000);

	// test('crypto-browserify@3.11.0', async () => {
	// 	const built = await build({
	// 		inputFs: new UnpkgFs('crypto-browserify@3.11.0'),
	// 		entry: '/index.js',
	// 	});

	// 	expect(built).toBeInstanceOf(Buffer);
	// 	expect(built.toString().length).toBeGreaterThan(100);
	// }, 100000);

	// test('uuid@3.2.1', async () => {
	// 	const built = await build({
	// 		inputFs: new UnpkgFs('uuid@3.2.1'),
	// 		entry: '/v1.js',
	// 	});

	// 	expect(built).toBeInstanceOf(Buffer);
	// 	expect(built.toString().length).toBeGreaterThan(100);
	// }, 100000);
});
