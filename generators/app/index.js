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

    async prompting() {
        if (!this.isConf) {
            this.log(log.info('Prompting'));
            // TODO: ask for using rush
            // TODO: if yes, ask for npm, yarn or pnpm
            const boilerplatePrompt = {
                type: 'checkbox',
                name: 'projects',
                required: true,
                message: 'Which projects would you generate?',
                choices: []
            };
            const prompts = [];
            for (let projectName in starterProjects) {
                prompts.push(...starterProjects[projectName].prompting);
                boilerplatePrompt.choices.push({
                    name: projectName,
                    value: projectName
                });
            }
            prompts.unshift(boilerplatePrompt);
            this.conf = await this.prompt(prompts);
        }
    }

    configuring() {
        this.log(log.info('Configuring'));
    }

    writing() {
        this.conf.projects.forEach((project) => {
            const templateList = starterProjects[project].writing;
            const answers = this.conf[project];
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
            templateList.forEach((template) => this._writeFile(template, answers.applicationName, answers));
            this.fs.delete(this.destinationPath(answers.applicationName, 'templates'));
        });
    }

    install() {
        this.log(log.info('Setting Rush'));
        const done = this.async();
        process.chdir(this.destinationPath());
        this.spawnCommand('rush', ['init', 'overwrite-existing']).on('close', () => {
            const projectsRushConf = [];
            const { projects, ...apps } = this.conf;
            for (let appName in apps) {
                const app = apps[appName];
                projectsRushConf.push({
                    "packageName": app.applicationName,
                    "projectFolder": app.applicationName
                });
            }
            const rush = fs.readFileSync(path.join(__dirname, '..', 'templates', 'rush.json'), 'utf8');
            const rushConfig = JSON.parse(rush);
            rushConfig.projects.push(...projectsRushConf);
            fs.writeFileSync(this.destinationPath('rush.json'), JSON.stringify(rushConfig));
            const pnpmfile = this.destinationPath('common', 'config', 'rush', 'pnpmfile.js');
            if (this.fs.exists(pnpmfile)) {
                fs.unlinkSync(pnpmfile);
            }
            this.spawnCommand('rush', ['update']).on('close', () => {
                this.spawnCommand('rush', ['build']).on('close', () => {
                    done();
                });
            });
        });
    }

    end() {
        this.log(log.success('Your bootstraping is finished. Happy coding!'));
    }

}