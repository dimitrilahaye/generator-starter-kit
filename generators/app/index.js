const BaseGenerator = require('../generator-base');
const path = require('path');
const fs = require('fs');

module.exports = class extends BaseGenerator {
    isConfigurationFile;
    starterProjects;

    constructor(args, opts) {
        super(args, opts);
        this.starterProjects = this._getDirectories(path.join(path.join(__dirname, '..', '..'), 'generators'))
            .filter((dir) => dir !== 'app');
        //   this.option('skip-install');
    }
    _getDirectories(source) {
        return fs.readdirSync(source, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
    }
    _forEachProject(cb) {
        this.starterProjects.forEach(cb);
    }
    /**
     * Search for ./compose.json in the project root
     * If does not exist, launch prompt step.
     * Else, store the configuration then skip prompt step.
     */
    initializing() {
        // =======================================================
        // Checking the compose.json file
        // =======================================================
        if (!this.fs.exists(this.destinationPath('compose.json'))) {
            this.info('compose.yaml not found. Will launch prompts');
            return;
        }
        this.info('compose.json found. Writing step begins');
        const file = fs.readFileSync(this.destinationPath('compose.json'), 'utf8');
        // TODO: in conf json, separate .base and .boilerplates
        // TODO: then, update logic in sub generators
        this.configuration = { ...this.configuration, ...JSON.parse(file) };
        this.isConfigurationFile = true;
    }
    /**
     * Launch these base generator's global prompts then launch selected boilerplates generators
     */
    async prompting() {
        if (!this.isConfigurationFile) {
            this.info('Prompting base generator');
            // TODO: if use rush === true, ask for npm, yarn or pnpm
            // TODO: according to this answer, ask for current version

            // =======================================================
            // Preparing general prompts for starter-kit
            // =======================================================
            const boilerplatePrompts = [
                {
                    type: 'checkbox',
                    name: 'base.projects',
                    required: true,
                    message: 'Which projects would you generate?',
                    choices: []
                },
                {
                    type: 'confirm',
                    name: 'base.rush',
                    required: true,
                    message: 'Want you to use Rush?'
                }
            ];
            this._forEachProject((project) => {
                boilerplatePrompts[0].choices.push({
                    name: project,
                    value: project
                });
            });
            this.answers = await this.prompt(boilerplatePrompts);
            // =======================================================
            // Will now launch all choosen boilerplates generators
            // =======================================================
            this.info('Will now launch the generator(s) of your choosen boilerplate(s)');
            this.starterProjects = this.starterProjects.filter((project) => this.answers.base.projects.includes(project));
            this._forEachProject((project) => this.composeWith(require.resolve(path.join('..', project)), this.answers));
        }
    }
    /**
     * Nothing for now...
     */
    configuring() {
        this.info('Configuring base generator');
    }
    /**
     * Nothing for now...
     */
    writing() {
        this.info('Writing base generator');
    }
    /**
     * Launching rush init, update and build if asked
     */
    install() {
        const done = this.async();
        if (this.answers.base.rush) {
            this.info('Setting Rush');
            process.chdir(this.destinationPath());
            this.spawnCommand('rush', ['init', '--overwrite-existing']).on('close', async () => {
                // after rush init, overwrite rush.json with asked boilerplates
                const projectsRushConf = [];
                this._getDirectories(this.destinationPath())
                    .filter((dir) => dir !== 'common')
                    .forEach((project) => {
                        projectsRushConf.push({
                            "packageName": project,
                            "projectFolder": project
                        });
                    });
                const rushFile = fs.readFileSync(this.templatePath('rush.json'), 'utf8');
                const rushConfig = JSON.parse(rushFile);
                rushConfig.projects.push(...projectsRushConf);
                fs.writeFileSync(this.destinationPath('rush.json'), JSON.stringify(rushConfig));
                // remove pnpm file in rush conf
                const pnpmfile = this.destinationPath('common', 'config', 'rush', 'pnpmfile.js');
                if (this.fs.exists(pnpmfile)) {
                    fs.unlinkSync(pnpmfile);
                }
                // launch rush update then rush build
                await this.spawnCommands([['rush', ['update']], ['rush', ['build']]]);
                done();
            });
        } else {
            done();
        }
    }
    /**
     * This is the end, my friend.
     */
    end() {
        this.success('Your bootstraping is finished. Happy coding!');
    }

}