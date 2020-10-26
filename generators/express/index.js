const BaseGenerator = require('../generator-base');
const chalk = require('chalk');

module.exports = class extends BaseGenerator {

    constructor(args, opts) {
        super(args, opts);
        ///////////////////////////////////////////////////////////////////////
        // options and arguments setting. compose.json will overwrite them.
        ///////////////////////////////////////////////////////////////////////
        // yo starter-kit:express --ts
        this.option("ts", {
            description: 'Use typescript'
        });
        // yo starter-kit:express --npm
        this.option("npm", {
            description: 'Launch npm install and build after the process'
        });
        // yo starter-kit:express my-frontend-app
        this.argument("applicationName", {
            type: String,
            required: false,
            description: 'The application name'
        });
        // mandatory, this root name matches with the name of this generator
        this.root = 'express';
    }

    /**
     * According to the user choice to use typescript or not,
     * it copies the directory with the given name from templates subdirectory to project root.
     * @param {string} dir the name of the directory to copy
     */
    _copyTplDirectory(dir) {
        const { applicationName } = this.answers;
        const root = this.answers.typescript ? 'typescript' : 'javascript';
        this.fs.copyTpl(
            this.destinationPath(applicationName, '_', root, dir),
            this.destinationPath(applicationName, dir, '..'),
            this.answers
        );
    }

    /**
     * According to the user choice to use typescript or not,
     * it copies the file with the given name from templates subdirectory to project root.
     * @param {string} file the name of the file to copy
     */
    _copyTplFile(file) {
        const { applicationName } = this.answers;
        const root = this.answers.typescript ? 'typescript' : 'javascript';
        this.fs.copyTpl(
            this.destinationPath(applicationName, '_', root, file),
            this.destinationPath(applicationName, file),
            this.answers
        );
    }

    /**
     * Initialize this boilerplate answers.
     */
    initializing() {
        this.initializeBoilerplate();
    }

    async prompting() {
        // check if we already have some configuration for this boilerplate.
        if (!this.getBoilerplatesConfiguration()) {
            this.answers = await this.prompt([
                {
                    when: () => !this.options.applicationName,
                    type: 'input',
                    name: 'applicationName',
                    required: true,
                    message: `What is the name of your ${this.root} application?`
                },
                {
                    when: () => !this.options.ts,
                    type: 'confirm',
                    name: 'typescript',
                    required: true,
                    message: 'Would you like to use typescript?'
                },
                {
                    when: () => !this.options.npm,
                    type: 'confirm',
                    name: 'npm',
                    required: true,
                    message: 'Would you like to install and build project?'
                }
            ]);
        }
    }

    configuring() {
        if (!this.getBoilerplatesConfiguration()) {
            this.info(`Configuring ${this.root}`);
            if (this.options.applicationName) {
                this.answers.applicationName = this.options.applicationName;
            }
            if (this.options.ts) {
                this.answers.typescript = true;
            }
            if (this.options.npm) {
                this.answers.npm = true;
            }
        }
    }

    writing() {
        // Copying boilerplates files in destination path
        const { applicationName } = this.answers;
        this.info(`Writing files for ${chalk.red(applicationName)} (${this.root} boilerplate)`);
        this.fs.copy(
            this.templatePath('**/*'),
            this.destinationPath(applicationName),
            { globOptions: { dot: true, } }
        );
        // Doing templating stuff
        const { typescript } = this.answers;
        this.fs.copyTpl(
            this.destinationPath(applicationName, '_', 'package.json'),
            this.destinationPath(applicationName, 'package.json'),
            this.answers
        );
        if (typescript) {
            this._copyTplDirectory('src');
            ['tsconfig.json', 'tslint.json'].forEach(file => this._copyTplFile(file));
        } else {
            ['bin', 'public', 'routes', 'views'].forEach(dir => this._copyTplDirectory(dir));
            this._copyTplFile('app.js');
        }
        this.fs.delete(this.destinationPath(applicationName, '_'));
    }

    async install() {
        const { rush } = this.getBaseConfiguration() || {};
        const { npm } = this.answers;
        if (!rush && npm) {
            this.info(`install ${this.root}`);
            const { applicationName } = this.answers;
            await this.spawnCommandAsync('npm', ['install'], { cwd: this.destinationPath(applicationName) });
            await this.spawnCommandAsync('npm', ['run', 'build'], { cwd: this.destinationPath(applicationName) });
        }
    }

    end() {
        this.success(`Your bootstraping ${this.root} is finished. Happy coding!`);
    }
}