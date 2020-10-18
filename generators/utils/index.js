const path = require('path');
const chalk = require('chalk');

const error = chalk.bold.red;
const warning = chalk.keyword('orange');
const info = chalk.bold.blue;

module.exports = {
    rootPath: path.join(__dirname, '..', '..'),
    log: {
        error, warning, info
    }
}