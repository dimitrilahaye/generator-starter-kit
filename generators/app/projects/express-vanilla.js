const base = 'express-vanilla';
/**
 * prompts displayed by yeoman during generation
 */
const prompting = () => {
	return [
	    {
	        when: answers => answers.projects.includes(base),
	        type: 'input',
	        name: base + '.applicationName',
	        required: true,
	        message: `What is the name of your ${base} application?`
	    }
	]
}
/**
 * List of all the templates path into the boilerplate/templates folder
 * this method get answers variables in order to use (if needed) some logic to choose
 * which templates exporting in the destination path.
 */
const writing = ({ applicationName }) => {
	return ['routes/users.js', 'package.json'];
}
/**
 * in case this boilerplate needs `composer install`, and so on...
 */
const install = ({ applicationName }) => {
	return 'installing ' + base;
}

module.exports = {
    prompting, writing, install
}