const base = 'express-typescript';
// prompts displayed by yeoman during generation
const prompting = () => {
	return [
	    {
	        when: answers => answers.projects.includes(base),
	        type: 'input',
	        name: base + '.applicationName',
	        required: true,
	        message: `What is the name of your ${base} application?`
	    }
	];
}
// list of all the templates path into the boilerplate/templates folder
// this method get answers variables in order to use (if needed) some logic to choose
// which templates exporting in the destination path.
const writing = ({ applicationName }) => {
	return ['routes/home.ts', 'package.json'];
}
// in case this boilerplate needs `composer install`, and so on...
// could return array of args for this.spawnCommand
// [
//   ['composer', ['install']],
//   ['another-command', ['args']],
// ]
// Or maybe we should make these modules extending Generator too... maybe it could
// be easier like that
const install = ({ applicationName }) => {
	return 'installing ' + base;
}

module.exports = {
    prompting, writing, install
}