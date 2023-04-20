/**
 * createBarrelFile - creates a barrel file for a directory with subfolders containing JS files.
 * @param {string} rootDir - The root directory for creating the barrel file.
 * @param {String} [barrelFileName = 'index.js'] - The filename for the barrel file. Default is index.js.
 */
function createBarrelFile(rootDir = '.', barrelFileName = 'index.js') {
  const path = require('path');
  const fs = require('fs');

  // Get the absolute path for the barrel file
  const barrelFile = path.join(rootDir, barrelFileName);

  // Get subfolders in the root directory
  const subFolders = fs.readdirSync(rootDir, { withFileTypes: true })
    .filter(dir => dir.isDirectory())
    .map(dir => dir.name);

  let barrelContent = '';

  // Iterate over subfolders
  subFolders.forEach(folderName => {
    const folderPath = path.join(rootDir, folderName);

    // Get JS files in subfolder
    const files = fs.readdirSync(folderPath, { withFileTypes: true })
      .filter(file => file.isFile() && 
                      file.name.endsWith('.js') && 
                      !file.name.includes('test') && 
                      !file.name.includes('stories') && 
                      !file.name.includes('index') )
      .map(file => file.name);

    // If there are JS files in the subfolder
    if (files.length > 0) {
      barrelContent += `/* ${folderName} */\n`;

      // Iterate over JS files in subfolder
      files.forEach(fileName => {
        barrelContent += `export { default as ${path.basename(fileName, '.js')} } from './${folderName}/${fileName}';\n`;
      });

      barrelContent += '\n';
    }
  });

  // Write barrel file
  fs.writeFileSync(barrelFile, barrelContent);
  
  console.log('Barrel file created successfully!');
}


const rootDir = process.argv[2] || '.';   
createBarrelFile(rootDir, 'index.js');
 