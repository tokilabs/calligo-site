const fs = require('fs').promises;
const path = require('path');

const directoryPath = path.join(__dirname + "/src/sharetribe"); // The root directory path

// List of folders to exclude from the conversion
const excludedFolders = [
  "node_modules", // Example excluded folder
  "public", 
  "scripts", 
  "server", 
  "src/analytics", 
  "src/config", 
  "src/ducks", 
].map(folder => path.join(directoryPath, folder));

// Function to recursively get all the files in a directory, excluding specified folders
async function getAllFiles(dirPath, arrayOfFiles) {
  if (excludedFolders.includes(dirPath)) {
    // Skip this directory if it is in the excludedFolders list
    return arrayOfFiles || [];
  }

  const files = await fs.readdir(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = await fs.stat(filePath);

    if (stat.isDirectory()) {
      arrayOfFiles = await getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  }

  return arrayOfFiles;
}

async function convertToJSX(files) {
  for (const file of files) {
    let fileContent = await fs.readFile(file, 'utf8');

    if (file.endsWith('.js')) {
      // Rename file from .js to .jsx
      const newFilePath = file.replace(/\.js$/, '.jsx');
      await fs.rename(file, newFilePath);

      // Find all import statements for .js files
      const importRegex = /import\s+([a-zA-Z0-9{}*\s,]+)\s+from\s+['"`]([./a-zA-Z0-9@\-_]+)\.js['"`]/g;
      let match;
      let importsToCheck = [];

      while ((match = importRegex.exec(fileContent)) !== null) {
        // Construct the path for the imported .js file
        const importedJsFilePath = path.join(path.dirname(file), `${match[2]}.js`);
        // Construct the path for the potential .jsx file
        const importedJsxFilePath = path.join(path.dirname(file), `${match[2]}.jsx`);

        importsToCheck.push({
          matchStr: match[0],
          jsPath: importedJsFilePath,
          jsxPath: importedJsxFilePath,
          importPath: match[2],
        });
      }

      // Check each import statement for an existing .jsx file
      for (const importCheck of importsToCheck) {
        try {
          await fs.access(importCheck.jsxPath);
          // If .jsx file exists, replace .js with .jsx in the import path
          fileContent = fileContent.replace(importCheck.matchStr, importCheck.matchStr.replace('.js', '.jsx'));
        } catch (error) {
          // .jsx file does not exist, no action needed
        }
      }

      // Write the updated content back to the file
      await fs.writeFile(newFilePath, fileContent, 'utf8');
    }
  }
}
async function removeJsExtensionsFromImports(files) {
  // Convert each file path in the array to just its file name without extension
  const fileNames = files.map(file => {
    // Assuming the file paths in the array are the full paths, extract the file name without the '.js' extension
    return file.substring(file.lastIndexOf('/') + 1, file.length - 3);
  });

  for (const file of files) {
    let fileContent = await fs.readFile(file, 'utf8');

    // Find all import statements for .js files
    const importRegex = /import\s+([a-zA-Z0-9{}*\s,]+)\s+from\s+['"`]([./a-zA-Z0-9@\-_]+)\.js['"`]/g;
    
    // Modify the file content based on whether the imported file is in the 'files' array
    fileContent = fileContent.replace(importRegex, (match, p1, importPath) => {
      // Extract the file name from the import path
      const importedFileName = importPath.substring(importPath.lastIndexOf('/') + 1);

      // If the imported file's name (without .js) exists in our fileNames array, remove the .js extension
      if (fileNames.includes(importedFileName)) {
        return `import ${p1} from '${importPath}'`;
      } else {
        // If not found, keep the .js extension
        return match;
      }
    });
   
    // Write the updated content back to the same file
    await fs.writeFile(file, fileContent, 'utf8');
  }
}

// async function updatePackageJson() {
//   const packageJsonPath = path.join(directoryPath, 'package.json');
//   try {
//     const packageJsonContent = await fs.readFile(packageJsonPath, 'utf8');
//     let packageJson = JSON.parse(packageJsonContent);
    
//     if (packageJson.scripts) {
//       for (const script in packageJson.scripts) {
//         // Adjust the line below for .js to .jsx conversion if needed
//         packageJson.scripts[script] = packageJson.scripts[script].replace(/\.jsx/g, '.js');
//       }
//       await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
//       console.log('Updated package.json scripts successfully.');
//     }
//   } catch (error) {
//     console.error('Error updating package.json:', error);
//   }
// }

(async () => {
  try {
    const allFiles = await getAllFiles(directoryPath);
    const jsFiles = allFiles.filter(file => file.endsWith('.js'));

    await removeJsExtensionsFromImports(jsFiles)
    await convertToJSX(jsFiles);
    // await updatePackageJson();


    console.log('Conversion to JSX completed.');
  } catch (error) {
    console.error('Error converting files to JSX:', error);
  }
})();
