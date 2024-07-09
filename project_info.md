# Информация о проекте

## Структура проекта

```
InfoCollector
├── collect-project-info.mjs
├── package-lock.json
├── package.json
└── project_info.md```

## Содержимое выбранных файлов

### /Users/amchercashin/InfoCollector/collect-project-info.mjs

```
import inquirer from 'inquirer';
import TreePrompt from 'inquirer-tree-prompt';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import tree from 'tree-node-cli';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

inquirer.registerPrompt('tree', TreePrompt);

function createFileTree(dir, parent = '') {
  const items = fs.readdirSync(dir);
  return items.map(item => {
    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);
    const isDirectory = stats.isDirectory();
    return {
      value: fullPath,
      name: item,
      children: isDirectory ? createFileTree(fullPath, path.join(parent, item)) : undefined,
      type: isDirectory ? 'directory' : 'file'
    };
  });
}

async function selectFiles(directory) {
  const fileTree = createFileTree(directory);
  const { selectedPaths } = await inquirer.prompt([
    {
      type: 'tree',
      name: 'selectedPaths',
      message: 'Выберите файлы и папки (используйте пробел для выбора, стрелки для навигации):',
      tree: fileTree,
      multiple: true,
      validate: (value) => value.length > 0 ? true : 'Выберите хотя бы один элемент.',
    }
  ]);

  return selectedPaths;
}

function getAllFiles(items) {
  let files = [];
  for (const item of items) {
    if (fs.statSync(item).isDirectory()) {
      files = files.concat(getAllFiles(
        fs.readdirSync(item).map(child => path.join(item, child))
      ));
    } else {
      files.push(item);
    }
  }
  return files;
}

function getProjectStructure(directory) {
  return tree(directory, {
    allFiles: true,
    exclude: [/node_modules/, /\.git/],
  });
}

function getFileContent(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

async function main() {
  const projectDirectory = process.cwd();
  const selectedItems = await selectFiles(projectDirectory);
  const selectedFiles = getAllFiles(selectedItems);

  let output = '# Информация о проекте\n\n';

  output += '## Структура проекта\n\n';
  output += '```\n';
  output += getProjectStructure(projectDirectory);
  output += '```\n\n';

  output += '## Содержимое выбранных файлов\n\n';
  for (const file of selectedFiles) {
    output += `### ${file}\n\n`;
    output += '```\n';
    output += getFileContent(file);
    output += '```\n\n';
  }

  const outputPath = path.join(projectDirectory, 'project_info.md');
  fs.writeFileSync(outputPath, output);

  console.log(`Информация о проекте сохранена в файл: ${outputPath}`);
}

main().catch(console.error);```

### /Users/amchercashin/InfoCollector/package.json

```
{
  "name": "infocollector",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "inquirer": "^8.2.5",
    "inquirer-tree-prompt": "^1.1.2",
    "tree-node-cli": "^1.6.0"
  }
}
```

