const base = 'express-vanilla';
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
const writing = ['routes/users.js', 'package.json'];

module.exports = {
    prompting, writing
}