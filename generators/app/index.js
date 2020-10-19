const Generator = require('yeoman-generator');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const starterProjects = require('./projects/starter-projects');

const { rootPath, log } = require('../utils');

module.exports = class extends Generator {
    isConf;
    conf;

    constructor(args, opts) {
        super(args, opts);
        this.isConf = false;
        //   this.option('skip-install');
    }

    /**
     * @param {string} templatePath the path to the file into the templates folder
     * @param {string} appName the applicationName submitted by the user for this boilerplate
     * @param {any} params the answer object related to this boilerplate prompt
     */
    _writeFile(templatePath, appName, params) {
        const template = path.join(this.destinationPath(appName), 'templates', templatePath);
        const destination = path.join(this.destinationPath(appName), templatePath);
        this.fs.copyTpl(template, destination, params);
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
            this.log(log.info('compose.yaml not found. Will launch prompts'));
            this.isConf = false;
            return;
        }
        this.log(log.info('compose.json found. Writing step begins'));
        this.isConf = true;
        const file = fs.readFileSync(this.destinationPath('compose.json'), 'utf8');
        this.conf = JSON.parse(file);
    }
    /**
     * Launch these generator's global prompts then each choosen boilerplate prompts.
     */
    async prompting() {
        if (!this.isConf) {
            this.log(log.info('Prompting'));
            // TODO: if use rush === true, ask for npm, yarn or pnpm
            // TODO: according to this answer, ask for current version

            // =======================================================
            // Preparing general prompts for starter-kit
            // =======================================================
            const boilerplatePrompt = [
                {
                    type: 'checkbox',
                    name: 'projects',
                    required: true,
                    message: 'Which projects would you generate?',
                    choices: []
                },
                {
                    type: 'confirm',
                    name: 'rush',
                    required: true,
                    message: 'Want you to use Rush?'
                }
            ];
            // =======================================================
            // Preparing specific prompts for each boilerplates
            // =======================================================
            const prompts = [];
            for (let projectName in starterProjects) {
                prompts.push(...starterProjects[projectName].prompting());
                boilerplatePrompt[0].choices.push({
                    name: projectName,
                    value: projectName
                });
            }
            prompts.unshift(...boilerplatePrompt);
            this.conf = await this.prompt(prompts);
        }
    }
    /**
     * Nothing for now...
     */
    configuring() {
        this.log(log.info('Configuring'));
    }
    /**
     * Copy to the destination path the files of each boilerplate.
     * Proceed templating for each of them.
     */
    writing() {
        this.conf.projects.forEach((project) => {
            // =======================================================
            // Copying boilerplates files in destination path
            // =======================================================
            const answers = this.conf[project];
            const templateList = starterProjects[project].writing(answers);
            this.log(log.info(`Writing files for ${chalk.red(answers.applicationName)} (${chalk.yellow(project)} boilerplate)`));
            this.fs.copy(
                path.join(rootPath, project),
                this.destinationPath(answers.applicationName),
                {
                    globOptions: {
                        dot: true
                    }
                }
            );
            // =======================================================
            // Doing templating stuff
            // =======================================================
            templateList.forEach((template) => this._writeFile(template, answers.applicationName, answers));
            this.fs.delete(this.destinationPath(answers.applicationName, 'templates'));
        });
    }
    /**
     * Launch the commands setted for each boilerplate.
     * Then if asked, configure Rush.
     */
    async install() {
        const done = this.async();
        // =======================================================
        // Launching install step for each projects
        // =======================================================
        this.log(log.info('Preparing projects install step'));
        const spawnsPromises = [];
        this.conf.projects.forEach((project) => {
            const answers = this.conf[project];
            const spawns = starterProjects[project].install(answers);
            const projectSpawns = spawns.reduce((c, spawn) => {
                const p = new Promise((res, rej) => {
                    this.spawnCommand(...spawn).on('close', () => res());
                });
                c.push(p);
                return c;
            }, []);
            spawnsPromises.push(...projectSpawns);
        });
        await Promise.all(spawnsPromises).then(() => this.log(log.info('End of projects install step')));
        // =======================================================
        // Launching rush init, update and build if asked
        // =======================================================
        if (this.conf.rush) {
            this.log(log.info('Setting Rush'));
            process.chdir(this.destinationPath());
            this.spawnCommand('rush', ['init', '--overwrite-existing']).on('close', () => {
                // after rush init, overwrite rush.json with asked boilerplates
                const projectsRushConf = [];
                const { projects, rush, ...apps } = this.conf;
                for (let appName in apps) {
                    const app = apps[appName];
                    projectsRushConf.push({
                        "packageName": app.applicationName,
                        "projectFolder": app.applicationName
                    });
                }
                const rushFile = fs.readFileSync(path.join(__dirname, '..', 'templates', 'rush.json'), 'utf8');
                const rushConfig = JSON.parse(rushFile);
                rushConfig.projects.push(...projectsRushConf);
                fs.writeFileSync(this.destinationPath('rush.json'), JSON.stringify(rushConfig));
                // remove pnpm file in rush conf
                const pnpmfile = this.destinationPath('common', 'config', 'rush', 'pnpmfile.js');
                if (this.fs.exists(pnpmfile)) {
                    fs.unlinkSync(pnpmfile);
                }
                // launch rush update then rush build
                this.spawnCommand('rush', ['update']).on('close', () => {
                    this.spawnCommand('rush', ['build']).on('close', () => {
                        done();
                    });
                });
            });
        }
    }
    /**
     * This is the end, my friend.
     */
    end() {
        this.log(log.success('Your bootstraping is finished. Happy coding!'));
    }

}