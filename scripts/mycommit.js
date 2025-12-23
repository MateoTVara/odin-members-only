const exec = require('child_process').execSync;
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');

const mycommit = () => {
    try {
        console.log('Creating logs directory and saving git info...');
        exec(`mkdir -p ${path.join(rootDir, 'logs')}`);
        exec(`git diff --staged > ${path.join(rootDir, 'logs', 'staged.diff')}`);
        exec(`git log > ${path.join(rootDir, 'logs', 'commits.log')}`);
        exec(`node ${path.join(rootDir, 'scripts', 'tree.js')} > ${path.join(rootDir, 'logs', 'project_tree.log')}`);
        console.log('Logs created in logs/ directory.');
    } catch (error) {
        console.error('Error creating logs:', error);
    }
}

mycommit();