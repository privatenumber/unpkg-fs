const parseUnpkgUrl = require('../lib/util/parse-unpkg-url');

test('package', () => {
	const parsed = parseUnpkgUrl(new URL('https://unpkg.com/vue@2.6.11/dist/vue.js'));

	expect(parsed).toEqual({
		pkgName: 'vue',
		version: '2.6.11',
		filePath: '/dist/vue.js',
		browse: false,
	});
	expect(parsed.pkgId).toBe('vue@2.6.11');
});

test('org', () => {
	const parsed = parseUnpkgUrl(new URL('https://unpkg.com/@babel/code-frame@7.8.3/lib/index.js'));

	expect(parsed).toEqual({
		pkgName: '@babel/code-frame',
		version: '7.8.3',
		filePath: '/lib/index.js',
		browse: false,
	});
	expect(parsed.pkgId).toBe('@babel/code-frame@7.8.3');
});


test('no path', () => {
	const parsed = parseUnpkgUrl(new URL('https://unpkg.com/@babel/code-frame@7.8.3'));

	expect(parsed).toEqual({
		pkgName: '@babel/code-frame',
		version: '7.8.3',
		filePath: '',
		browse: false,
	});
	expect(parsed.pkgId).toBe('@babel/code-frame@7.8.3');
});

test('browse', () => {
	const parsed = parseUnpkgUrl(new URL('https://unpkg.com/browse/vue@2.6.11/'));

	expect(parsed).toEqual({
		pkgName: 'vue',
		version: '2.6.11',
		filePath: '/',
		browse: true,
	});
	expect(parsed.pkgId).toBe('vue@2.6.11');
});

test('toString()', () => {
	const parsed = parseUnpkgUrl(new URL('https://unpkg.com/browse/vue@2.6.11/'));

	expect(parsed).toEqual({
		pkgName: 'vue',
		version: '2.6.11',
		filePath: '/',
		browse: true,
	});

	parsed.version = '1.0.0';
	parsed.filePath = '/index.js';

	expect(parsed.toString()).toBe('/browse/vue@1.0.0/index.js');
});
