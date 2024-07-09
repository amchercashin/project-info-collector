import inquirer from 'inquirer';
import TreePrompt from 'inquirer-tree-prompt';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import tree from 'tree-node-cli';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

inquirer.registerPrompt('tree', TreePrompt);

function createDirectoryTree(dir, depth = 0) {
  if (depth > 1) return []; // Ограничение глубины для производительности
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    return items
      .filter(item => item.isDirectory() && !item.name.startsWith('.'))
      .map(item => {
        const fullPath = path.join(dir, item.name);
        try {
          const children = createDirectoryTree(fullPath, depth + 1);
          return {
            value: fullPath,
            name: item.name,
            children: children.length ? children : undefined
          };
        } catch (error) {
          console.warn(`Невозможно прочитать содержимое папки ${fullPath}: ${error.message}`);
          return {
            value: fullPath,
            name: item.name
          };
        }
      });
  } catch (error) {
    console.warn(`Невозможно прочитать содержимое папки ${dir}: ${error.message}`);
    return [];
  }
}

async function selectRootDirectory() {
  const homeDir = process.env.HOME || process.env.USERPROFILE;
  const directoryTree = createDirectoryTree(homeDir);
  
  const { rootDir } = await inquirer.prompt([
    {
      type: 'tree',
      name: 'rootDir',
      message: 'Выберите головную папку проекта:',
      tree: directoryTree,
      validate: (value) => value ? true : 'Выберите папку.'
    }
  ]);

  return rootDir;
}

function createFileTree(dir, parent = '') {
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    return items.map(item => {
      const fullPath = path.join(dir, item.name);
      const isDirectory = item.isDirectory();
      return {
        value: fullPath,
        name: item.name,
        children: isDirectory ? createFileTree(fullPath, path.join(parent, item.name)) : undefined,
        type: isDirectory ? 'directory' : 'file',
        isExpanded: false
      };
    });
  } catch (error) {
    console.warn(`Невозможно прочитать содержимое папки ${dir}: ${error.message}`);
    return [];
  }
}

function expandTree(node) {
  if (node.children) {
    node.isExpanded = true;
    node.children.forEach(expandTree);
  }
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
      onSelect: (node) => {
        if (node.type === 'directory' && !node.isExpanded) {
          expandTree(node);
        }
      }
    }
  ]);

  return selectedPaths;
}

function getAllFiles(items) {
  let files = [];
  for (const item of items) {
    try {
      const stats = fs.statSync(item);
      if (stats.isDirectory()) {
        files = files.concat(getAllFiles(
          fs.readdirSync(item).map(child => path.join(item, child))
        ));
      } else {
        files.push(item);
      }
    } catch (error) {
      console.warn(`Невозможно прочитать ${item}: ${error.message}`);
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
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.warn(`Невозможно прочитать содержимое файла ${filePath}: ${error.message}`);
    return `[Невозможно прочитать содержимое файла: ${error.message}]`;
  }
}

async function main() {
  const rootDirectory = await selectRootDirectory();
  const selectedItems = await selectFiles(rootDirectory);
  const selectedFiles = getAllFiles(selectedItems);

  let output = '# Информация о проекте\n\n';

  output += `## Головная папка проекта: ${rootDirectory}\n\n`;

  output += '## Структура проекта\n\n';
  output += '```\n';
  output += getProjectStructure(rootDirectory);
  output += '```\n\n';

  output += '## Содержимое выбранных файлов\n\n';
  for (const file of selectedFiles) {
    output += `### ${file}\n\n`;
    output += '```\n';
    output += getFileContent(file);
    output += '```\n\n';
  }

  const projectName = path.basename(rootDirectory);
  const outputPath = path.join(process.cwd(), `${projectName}_info.md`);
  fs.writeFileSync(outputPath, output);

  console.log(`Информация о проекте сохранена в файл: ${outputPath}`);
}

main().catch(console.error);