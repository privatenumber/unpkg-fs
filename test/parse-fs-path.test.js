const parseFsPath = require('../lib/util/parse-fs-path');

test('local path', () => {
	const parsed = parseFsPath('/some-dir/some-path.js');

	expect(parsed).toEqual({
		nodeModules: false,
		filePath: '/some-dir/some-path.js',
	});
});

test('dependency', () => {
	const parsed = parseFsPath('/node_modules/some-pkg/some-dir/some-path.js');

	expect(parsed).toEqual({
		nodeModules: true,
		pkgName: 'some-pkg',
		filePath: '/some-dir/some-path.js',
	});
	expect(parsed.pkgId).toBe(undefined);
});

test('dependency w/ version', () => {
	const parsed = parseFsPath('/node_modules/some-pkg@1.0.0/some-dir/some-path.js');
	expect(parsed).toEqual({
		nodeModules: true,
		pkgName: 'some-pkg',
		version: '1.0.0',
		filePath: '/some-dir/some-path.js',
	});
	expect(parsed.pkgId).toBe('some-pkg@1.0.0');
});

test('dependency org - invalid', () => {
	const parsed = parseFsPath('/node_modules/@org');
	expect(parsed).toEqual({
		nodeModules: true,
		pkgName: undefined,
		filePath: undefined,
	});
});

test('dependency org', () => {
	const parsed = parseFsPath('/node_modules/@org/pkg-name');
	expect(parsed).toEqual({
		nodeModules: true,
		pkgName: '@org/pkg-name',
		filePath: undefined,
	});
});

test('dependency org w/ path', () => {
	const parsed = parseFsPath('/node_modules/@org/some-pkg/some-dir/some-path.js');
	expect(parsed).toEqual({
		nodeModules: true,
		pkgName: '@org/some-pkg',
		version: undefined,
		pkgId: undefined,
		filePath: '/some-dir/some-path.js',
	});
});

test('pkgName', () => {
	const parsed = parseFsPath('/node_modules/@org/some-module@1.0.0');

	expect(parsed).toEqual({
		nodeModules: true,
		pkgName: '@org/some-module',
		version: '1.0.0',
		filePath: undefined,
	});
	expect(parsed.pkgId).toBe('@org/some-module@1.0.0');
});

test('native module', () => {
	const parsed = parseFsPath('/node_modules/buffer@4.9.2/index.js');

	expect(parsed).toEqual({
		nodeModules: true,
		pkgName: 'buffer',
		version: '4.9.2',
		filePath: '/index.js',
	});
	expect(parsed.pkgId).toBe('buffer@4.9.2');
});

test('toString() no version', () => {
	const origPath = '/node_modules/@org/some-pkg/some-dir/some-path.js';
	const parsed = parseFsPath(origPath);

	expect(parsed).toEqual({
		nodeModules: true,
		pkgName: '@org/some-pkg',
		version: undefined,
		pkgId: undefined,
		filePath: '/some-dir/some-path.js',
	});

	parsed.pkgName = '@babel/babel';

	expect(parsed.toString()).toBe('/node_modules/@babel/babel/some-dir/some-path.js');
});

test('toString()', () => {
	const origPath = '/node_modules/@org/some-pkg/some-dir/some-path.js';
	const parsed = parseFsPath(origPath);

	expect(parsed).toEqual({
		nodeModules: true,
		pkgName: '@org/some-pkg',
		version: undefined,
		pkgId: undefined,
		filePath: '/some-dir/some-path.js',
	});

	parsed.pkgName = '@babel/babel';
	parsed.version = '1.0.0';

	expect(parsed.toString()).toBe('/node_modules/@babel/babel@1.0.0/some-dir/some-path.js');
});
