const Generator = require('yeoman-generator');
const chalk = require('chalk');

const error = chalk.bold.red;
const success = chalk.bold.green;
const warning = chalk.keyword('orange');
const info = chalk.bold.blue;

module.exports = class extends Generator {
    configuration = {};
    answers;
    constructor(args, opts) {
        super(args, opts);
        this.configuration.base = opts.base;
    }
    error(message) {
        this.log(error(message));
    }
    success(message) {
        this.log(success(message));
    }
    warning(message) {
        this.log(warning(message));
    }
    info(message) {
        this.log(info(message));
    }
    /**
     * For the given template path, templatize and overwrite the real file with this.answers.
     * Example templatize './templates/src/App.js' and overwrite './src/App.js'
     * @param {string} tpl the path to the file into the templates folder
     * @param {any} args variables to inject in the template
     */
    writeFile(tpl) {
        const { applicationName } = this.answers;
        const template = this.destinationPath(applicationName, 'templates', tpl);
        const destination = this.destinationPath(applicationName, tpl);
        this.fs.copyTpl(template, destination, this.answers);
    }
    /**
     * Launch commands then execute a callback
     * @param {any[]} spawns an array of string in this format [command, [...args]]
     * @param {Function} cb the return callback after all commands have been launched
     */
    async spawnCommands(spawns, cb) {
        const spawnsPromises = spawns.reduce((c, spawn) => {
            const p = new Promise((res, rej) => {
                this.spawnCommand(...spawn).on('close', () => res());
            });
            c.push(p);
            return c;
        }, []);
        await Promise.all(spawnsPromises).then(() => cb && cb());
    }
}