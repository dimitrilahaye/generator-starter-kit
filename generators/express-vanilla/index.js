const BaseGenerator = require('../generator-base');
const chalk = require('chalk');

module.exports = class extends BaseGenerator {
    constructor(args, opts) {
        super(args, opts);
    }
    initializing() {
        this.info('initializing express-vanilla');
        if (this.getBoilerplatesConfiguration()) {
            this.answers = this.getBoilerplateConfiguration('express-vanilla');
        }
    }
    async prompting() {
        if (!this.getBoilerplatesConfiguration()) {
            this.answers = await this.prompt([
                {
                    type: 'input',
                    name: 'applicationName',
                    required: true,
                    message: `What is the name of your express-vanilla application?`
                }
            ]);
        }
    }
    configuring() {
        this.info('Configuring express-vanilla');
    }
    writing() {
        this.info('writing express-vanilla');
        // =======================================================
        // Copying boilerplates files in destination path
        // =======================================================
        const { applicationName } = this.answers;
        this.info(`Writing files for ${chalk.red(applicationName)} (express-vanilla boilerplate)`);
        this.fs.copy(
            this.templatePath('**/*'),
            this.destinationPath(applicationName),
            { globOptions: { dot: true, } }
        );
        // =======================================================
        // Doing templating stuff
        // =======================================================
        const templates = ['routes/users.js', 'package.json'];
        templates.forEach((template) => this.writeFile(template));
        this.fs.delete(this.destinationPath(applicationName, 'templates'));
    }
    async install() {
        this.info('install express-vanilla');
        const spawns = [
            ['node', ['-v']],
            ['npm', ['-v']],
        ];
        await this.spawnCommands(spawns, () => this.info('End of express-vanilla install step'));
    }
    end() {
        this.success('Your bootstraping express-vanilla is finished. Happy coding!');
    }
}