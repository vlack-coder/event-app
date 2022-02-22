const path = require("path");
const fs = require("fs");

const makeFolders = ({ fs, path }) => {
  return function create() {
    const dir = path.resolve("images");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      console.log("Folder for QR created!");
    }
  };
};

const makeFolder = makeFolders({ fs, path })

module.exports = makeFolder;