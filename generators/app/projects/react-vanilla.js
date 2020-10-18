const base = 'react-vanilla';
// prompts displayed by yeoman during generation
const prompting = [
    {
        when: answers => answers.projects.includes(base),
        type: 'input',
        name: base + '.applicationName',
        required: true,
        message: `What is the name of your ${base} application?`
    }
]
// list of all the templates path into the boilerplate/templates folder
const writing = ['src/App.js', 'package.json'];

module.exports = {
    prompting, writing
}