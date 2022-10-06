const { cwd } = require('node:process');
const { writeFileSync }= require('node:fs');

// add associated type to package.json in each cjs/esm dist folder
addAssociatedType('commonjs');
addAssociatedType('module');

function addAssociatedType(type) {
  try {
    const pkg = {
      "type": type
    };
    // if (type === 'module') {
    //   pkg.browser = "src/index.ts";
    // }

    let distFolder = 'dist/';
    distFolder += type === 'commonjs' ? 'commonjs' : 'esm';
    const pkgLocation = `${cwd()}/${distFolder}/package.json`;

    writeFileSync(pkgLocation, JSON.stringify(pkg, null, 2), 'utf8');
    console.log(`Successfully added CommonJS type in ${pkgLocation}`);
  } catch (err) {
    console.log(`Error reading/writing file: ${err}`);
  }
}
