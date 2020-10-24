const BaseGenerator = require('../generator-base');
const chalk = require('chalk');

module.exports = class extends BaseGenerator {
    constructor(args, opts) {
        super(args, opts);
        // yo starter-kit:react --ts
        this.option("ts");
        // yo starter-kit:react --npm
        this.option("npm");
        this.root = 'react';
    }

    initializing() {
        this.info(`initializing ${this.root}`);
        this.initBoilerplateAnswers();
    }

    async prompting() {
        if (!this.getBoilerplatesConfiguration()) {
            this.answers = await this.prompt([
                {
                    type: 'input',
                    name: 'applicationName',
                    required: true,
                    message: `What is the name of your ${this.root} application?`
                },
                {
                    when: () => this.options.ts === undefined,
                    type: 'confirm',
                    name: 'typescript',
                    required: true,
                    message: 'Would you to use typescript?'
                },
                {
                    when: () => this.options.npm === undefined,
                    type: 'confirm',
                    name: 'npm',
                    required: true,
                    message: 'Would you to install and build project?'
                }
            ]);
        }
    }

    configuring() {
        this.info(`Configuring ${this.root}`);
        if (this.options.ts) {
            this.answers.typescript = true;
        }
        if (this.options.npm) {
            this.answers.npm = true;
        }
    }

    writing() {
        this.info(`writing ${this.root}`);
        // =======================================================
        // Copying boilerplates files in destination path
        // =======================================================
        const { applicationName } = this.answers;
        this.info(`Writing files for ${chalk.red(applicationName)} (${this.root} boilerplate)`);
        this.fs.copy(
            this.templatePath('**/*'),
            this.destinationPath(applicationName),
            { globOptions: { dot: true, } }
        );
        // =======================================================
        // Doing templating stuff
        // =======================================================
        const typescript = this.options.ts || this.answers.typescript;
        this.fs.copyTpl(
            this.destinationPath(applicationName, 'templates', typescript ? 'typescript' : 'javascript', 'src'),
            this.destinationPath(applicationName, 'src', '..'),
            this.answers
        );
        this.fs.copyTpl(
            this.destinationPath(applicationName, 'templates', 'package.json'),
            this.destinationPath(applicationName, 'package.json'),
            this.answers
        );
        if (typescript) {
            this.fs.copyTpl(
                this.destinationPath(applicationName, 'templates', 'typescript', 'tsconfig.json'),
                this.destinationPath(applicationName, 'tsconfig.json'),
                this.answers
            );
        }
        this.fs.delete(this.destinationPath(applicationName, 'templates'));
    }

    async install() {
        const { rush } = this.getBaseConfiguration();
        const npm = this.options.npm || this.answers.npm;
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