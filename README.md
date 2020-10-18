## install global deps in order to make this generator working

```
npm install -g yo               # needed for the yeoman CLI and all its stuff
npm install -g @microsoft/rush  # needed to the rush monorepo part.
```

## how to run the starter-kit generator in local

```
cd /your/generator-starter-kit/root
npm install # the first time
npm link
yo starter-kit
```

> if you want to skip yeoman prompting, copy compose.yaml.example then rename it `compose.yaml` and update it according to your needs.




## rush main commands

### after each project package.json modifications

```
rush update
```

### after pulled last changes

```
rush rebuild
```

### run npm build for each project
```
rush build
```
