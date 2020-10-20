## install global deps in order to make this generator working

```
npm install -g yo               # needed for the yeoman CLI and all its stuff
npm install -g @microsoft/rush  # needed to the rush monorepo part.
```

## how to run the starter-kit generator in local

```
cd generator-starter-kit
npm install
npm link
cd /my-project
yo starter-kit
# you can also call generators separately:
yo starter-kit:react-typescript
yo starter-kit:express-vanilla
```

> If you want to skip yeoman prompting, copy compose.json.example into your project folder,
rename it `compose.json` then update it according to your needs.