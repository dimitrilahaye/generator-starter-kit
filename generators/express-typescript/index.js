const BaseGenerator = require('../generator-base');
const chalk = require('chalk');

module.exports = class extends BaseGenerator {
    constructor(args, opts) {
        super(args, opts);
    }
    initializing() {
        this.info('initializing express-typescript');
    }
    async prompting() {
        this.answers = await this.prompt([
            {
                type: 'input',
                name: 'applicationName',
                required: true,
                message: `What is the name of your express-typescript application?`
            }
        ]);
    }
    configuring() {
        this.info('Configuring express-typescript');
    }
    writing() {
        // =======================================================
        // Copying boilerplates files in destination path
        // =======================================================
        const { applicationName } = this.answers;
        this.info(`Writing files for ${chalk.red(applicationName)} (express-typescript boilerplate)`);
        this.fs.copy(
            this.templatePath('**/*'),
            this.destinationPath(applicationName),
            { globOptions: { dot: true, } }
        );
        // =======================================================
        // Doing templating stuff
        // =======================================================
        const templates = ['src/routes/home.ts', 'package.json'];
        templates.forEach((template) => this.writeFile(template));
        this.fs.delete(this.destinationPath(applicationName, 'templates'));
    }
    async install() {
        this.info('install express-typescript');
        const spawns = [
            ['node', ['-v']],
            ['npm', ['-v']],
        ];
        await this.spawnCommands(spawns, () => this.info('End of express-typescript install step'));
    }
    end() {
        this.success('Your bootstraping express-typescript is finished. Happy coding!');
    }
}