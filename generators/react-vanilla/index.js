const BaseGenerator = require('../generator-base');
const chalk = require('chalk');

module.exports = class extends BaseGenerator {
    constructor(args, opts) {
        super(args, opts);
    }
    initializing() {
        this.info('initializing react-vanilla');
    }
    async prompting() {
        this.answers = await this.prompt([
            {
                type: 'input',
                name: 'applicationName',
                required: true,
                message: `What is the name of your react-vanilla application?`
            }
        ]);
    }
    configuring() {
        this.info('Configuring react-vanilla');
    }
    writing() {
        this.info('writing react-vanilla');
        // =======================================================
        // Copying boilerplates files in destination path
        // =======================================================
        const { applicationName } = this.answers;
        this.info(`Writing files for ${chalk.red(applicationName)} (react-vanilla boilerplate)`);
        this.fs.copy(
            this.templatePath('**/*'),
            this.destinationPath(applicationName),
            { globOptions: { dot: true, } }
        );
        // =======================================================
        // Doing templating stuff
        // =======================================================
        const templates = ['src/App.js', 'package.json'];
        templates.forEach((template) => this.writeFile(template));
        this.fs.delete(this.destinationPath(applicationName, 'templates'));
    }
    async install() {
        this.info('install react-vanilla');
        const spawns = [
            ['node', ['-v']],
            ['npm', ['-v']],
        ];
        await this.spawnCommands(spawns, () => this.info('End of react-vanilla install step'));
    }
    end() {
        this.success('Your bootstraping react-vanilla is finished. Happy coding!');
    }
}