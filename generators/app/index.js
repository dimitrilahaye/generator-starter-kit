const Generator = require('yeoman-generator');
const path = require('path');
const YAML = require('yaml');
const fs = require('fs');

const starterProjects = require ('./projects/starter-projects');

const {rootPath, log} = require('../utils');

module.exports = class extends Generator {
    isConfig;
    config;

    constructor(args, opts) {
        super(args, opts);
        this.isConfig = false;
        //   this.option('skip-install');
    }

    // this._writeFile('express-vanilla', 'routes/users.js', 'my-app')
    _writeFile(projectSrc, templatePath, appName, params) {
        const template = path.join(rootPath, projectSrc, 'templates', templatePath);
        const destination = path.join(rootPath, 'projects', appName , templatePath);
        if (!this.fs.exists(destination)) {
            this.fs.copyTpl(template, destination, params);
        }
    }

    /**
     * Search for ./compose.yaml
     * If does not exist, launch prompt step.
     * Else, store the configuration then skip prompt step.
    */
    initializing() {
        if (!this.fs.exists(path.join(rootPath, 'compose.yaml'))) {
            this.log(log.info('compose.yaml not found. Will launch prompts'));
            this.isConfig = false;
        }
        this.log(log.info('compose.yaml found. Validation begins'));
        // TODO: if validation is ok
        this.isConfig = true;
        const file = fs.readFileSync(path.join(rootPath, 'compose.yaml'), 'utf8');
        this.config = YAML.parse(file);
        console.log(this.config);
        // TODO: else: throw error
    }

    prompting() {
        if (!this.isConfig) {
            this.log('prompting');
        }
    }

    configuring() {
        this.log('configuring');
    }

    writing() {
        // TODO: template
        // TODO: copy files in the projects folder
        // TODO: remove templates folder
        this.log('writing');
    }

    install() {
        // TODO: go to projects folder
        // TODO: copy generators/templates/rush.json into projects folder
        // TODO: register the projects in the rush.json
        // TODO: rush init
        // TODO: rush build
        this.log('install');
    }

    end() {
        // Happy coding
        this.log('end');
    }

}