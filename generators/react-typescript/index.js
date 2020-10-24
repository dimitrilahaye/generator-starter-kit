const BaseGenerator = require('../generator-base');
const chalk = require('chalk');

module.exports = class extends BaseGenerator {
    constructor(args, opts) {
        super(args, opts);
        this.root = 'react-typescript';
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
                }
            ]);
        }
    }

    configuring() {
        this.info(`Configuring ${this.root}`);
    }

    writing() {
        this.info(`writing ${this.root}`);
        // =======================================================
        // Copying boilerplates files in destination path
        // =======================================================
        const {applicationName} = this.answers;
        this.info(`Writing files for ${chalk.red(applicationName)} (${this.root} boilerplate)`);
        this.fs.copy(
            this.templatePath('**/*'),
            this.destinationPath(applicationName),
            {globOptions: {dot: true,}}
        );
        // =======================================================
        // Doing templating stuff
        // =======================================================
        const templates = ['src/App.tsx', 'package.json'];
        templates.forEach((template) => this.writeFile(template));
        this.fs.delete(this.destinationPath(applicationName, 'templates'));
    }

    async install() {
        const { rush } = this.getBaseConfiguration();
        if (!rush) {
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