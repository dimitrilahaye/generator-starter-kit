const BaseGenerator = require('../generator-base');
const chalk = require('chalk');

module.exports = class extends BaseGenerator {
    constructor(args, opts) {
        super(args, opts);
        ///////////////////////////////////////////////////////////////////////
        // options and arguments setting. compose.json will overwrite them.
        ///////////////////////////////////////////////////////////////////////
        // yo starter-kit:react --ts
        this.option("ts", {
            description: 'Use typescript'
        });
        // yo starter-kit:react --sentry
        this.option("sentry", {
            description: 'Install sentry'
        });
        // yo starter-kit:react --npm
        this.option("npm", {
            description: 'Launch npm install and build after the process'
        });
        // yo starter-kit:react my-frontend-app
        this.argument("applicationName", {
            type: String,
            required: false,
            description: 'The application name'
        });
        // mandatory, this root name matches with the name of this generator
        this.root = 'react';
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
                    when: () => !this.options.sentry,
                    type: 'confirm',
                    name: 'sentry',
                    required: true,
                    message: 'Would you like to use sentry?'
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
            if (this.options.sentry) {
                this.answers.sentry = true;
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
        const typescript = this.answers.typescript;
        this.fs.copyTpl(
            this.destinationPath(applicationName, '_', typescript ? 'typescript' : 'javascript', 'src'),
            this.destinationPath(applicationName, 'src', '..'),
            this.answers
        );
        this.fs.copyTpl(
            this.destinationPath(applicationName, '_', 'package.json'),
            this.destinationPath(applicationName, 'package.json'),
            this.answers
        );
        if (typescript) {
            this.fs.copyTpl(
                this.destinationPath(applicationName, '_', 'typescript', 'tsconfig.json'),
                this.destinationPath(applicationName, 'tsconfig.json'),
                this.answers
            );
        }
        this.fs.delete(this.destinationPath(applicationName, '_'));
    }

    async install() {
        const { rush } = this.getBaseConfiguration() || {};
        const { npm, sentry, applicationName } = this.answers;
        // FIXME: conflict with main generator {rush} option.
        if (sentry) {
            this.npmInstall(['@sentry/react'], { save: true }, { cwd: this.destinationPath(applicationName) });
        }
        if (!rush && npm) {
            this.info(`install ${this.root}`);
            await this.spawnCommandAsync('npm', ['install'], { cwd: this.destinationPath(applicationName) });
            await this.spawnCommandAsync('npm', ['run', 'build'], { cwd: this.destinationPath(applicationName) });
        }
    }

    end() {
        this.success(`Your bootstraping ${this.root} is finished. Happy coding!`);
    }
}