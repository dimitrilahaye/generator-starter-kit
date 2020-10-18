/*
Each require of this module is one boilerplate generator
When you've created a generator for a new boilerplate, you have to reference it there.
*/
const reactVanilla = require('./react-vanilla');
const reactTypescript = require('./react-typescript');
const expressVanilla = require('./express-vanilla');
const expressTypescript = require('./express-typescript');


module.exports = {
    "react-vanilla": reactVanilla, // Key of the generator export must match the folder name of the boilerplate
    "react-typescript": reactTypescript,
    "express-vanilla": expressVanilla,
    "express-typescript": expressTypescript
}