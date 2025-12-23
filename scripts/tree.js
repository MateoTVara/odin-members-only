const fs = require('node:fs');
const path = require('node:path');

const rootPath = path.resolve(__dirname, '..');
const EXCLUDED_DIRS = new Set(['node_modules', '.git']);

const printTree = (dir, prefix = '') => {
    const items = fs.readdirSync(dir, { withFileTypes: true })
        .filter(item => !EXCLUDED_DIRS.has(item.name))
        .sort((a, b) => a.name.localeCompare(b.name));

    items.forEach((item, index) => {
        const isLast = index === items.length - 1;
        const pointer = isLast ? '└── ' : '├── ';
        console.log(prefix + pointer + item.name);

        if (item.isDirectory()) {
            const newPrefix = prefix + (isLast ? '    ' : '│   ');
            printTree(path.join(dir, item.name), newPrefix);
        }
    });
}

printTree(rootPath);