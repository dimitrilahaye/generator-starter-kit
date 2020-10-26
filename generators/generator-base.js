const Generator = require('yeoman-generator');
const chalk = require('chalk');
const fs = require('fs');

const error = chalk.bold.red;
const success = chalk.bold.green;
const warning = chalk.keyword('orange');
const info = chalk.bold.blue;

module.exports = class extends Generator {
    configuration;
    answers;
    root;

    constructor(args, opts) {
        super(args, opts);
        this.configuration = opts;
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
     * Return true if we have got a compose.json file in the destination path.
     */
    hasConfigurationFile() {
        return this.fs.exists(this.destinationPath('compose.json'));
    }

    /**
     * Initialize environment from compose.json
     */
    initConfigurationFromFile() {
        const file = fs.readFileSync(this.destinationPath('compose.json'), 'utf8');
        const conf = JSON.parse(file);
        if (this.root === 'base') {
            this.answers = this.configuration = { ...this.configuration, ...conf };
            return;
        } else if (!conf.boilerplates[this.root]) {
            this.error(`No configuration found in the compose.json for the ${this.root} generator.`);
            this.warning(`Exit generator.`);
            process.exit();
        }
        this.configuration.boilerplates = {};
        this.configuration.boilerplates[this.root] = conf.boilerplates[this.root];
        this.answers = this.configuration.boilerplates[this.root];
    }

    /**
     * Use in order to initialize a boilerplate answers.
     * If we have a base configuration (from main generator), we will initialize express generator answers from its.
     * If not, we look for a compose.json. If it does not exist, we will launch the prompts.
     * If it exists, we will use it for this generator's answers initialization.
     */
    initializeBoilerplate() {
        this.info(`initializing ${this.root}`);
        if (this.getBaseConfiguration()) {
            this.initBoilerplateAnswers();
            return;
        }
        this.info('Searching for the compose.json file.');
        if (!this.hasConfigurationFile()) {
            this.info('compose.json not found. Will launch prompts');
            return;
        }
        this.initConfigurationFromFile();
        this.info('compose.json found. Writing step begins.');
    }

    /**
     * Get the configuration of the base generator.
     * Those properties are used to set general configuration for the whole bootstraping job.
     * In the compose.json, you can set values in the object {base}.
     * @returns {string}
     */
    getBaseConfiguration() {
        return this.configuration.base;
    }

    /**
     * Get the configuration of the boilerplates generators.
     * Those properties are used to set specific configuration for the specific boilerplates jobs
     * In the compose.json, you can set values in the object {boilerplates}.
     * @returns {*}
     */
    getBoilerplatesConfiguration() {
        return this.configuration.boilerplates;
    }

    /**
     * Get the configuration of a specific boilerplate generator, according to the given generator {rootName}.
     * @param {string} rootName the name of the generator for which we want the configuration.
     * @returns {*}
     */
    getBoilerplateConfiguration(rootName) {
        return this.configuration.boilerplates && this.configuration.boilerplates[rootName];
    }

    /**
     * Will set the answers for the current boilerplate generator based on the compose.json content.
     */
    initBoilerplateAnswers() {
        this.answers = this.getBoilerplateConfiguration(this.root);
    }

    /**
     * For the given template path, templatize and overwrite the real file with this.answers.
     * Example templatize './templates/src/App.js' and overwrite './src/App.js'
     * @param {string} tpl the path to the file into the templates folder
     */
    writeFile(tpl) {
        const { applicationName } = this.answers;
        const template = this.destinationPath(applicationName, '_', tpl);
        const destination = this.destinationPath(applicationName, tpl);
        this.fs.copyTpl(template, destination, this.answers);
    }

    /**
     * Launch a command then return promise for success.
     * @param {string} command the command to launch
     * @param {string[]} args array of arguments
     * @param {*} opt options for yeoman spawnCommand (see documentation)
     */
    spawnCommandAsync(command, args, opt) {
        return new Promise((res, rej) => {
            this.spawnCommand(command, args, opt).on('close', () => res());
        });
    }
}