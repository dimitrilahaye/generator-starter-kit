## install global deps
npm install -g create-react-app
npm install -g express-generator
npm install -g nodemon concurrently
npm install -g @microsoft/rush

## rush main commands

### after each project package.json modifications
rush update

### after pulled last changes
rush rebuild

### run npm build for each project
rush build