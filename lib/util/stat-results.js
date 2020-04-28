class isFile {
	isDirectory() { return false; }
	isFile() { return true; }	
}

class isDirectory {
	isDirectory() { return true; }
	isFile() { return false; }
}

module.exports = {
	isFile: new isFile,
	isDirectory: new isDirectory,
};
