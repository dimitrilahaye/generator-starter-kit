## install global deps in order to make this generator working

```bash
npm install -g yo @microsoft/rush
```

## how to run the starter-kit generator in local

```bash
cd generator-starter-kit
npm install
npm link
cd /my-project
yo starter-kit
# you can also call generators separately:
yo starter-kit:react
yo starter-kit:express
# you can pass options to the commands
yo starter-kit:react --npm --ts
# here for a typescript react stack + launch npm install and build at the end of the process
```

> If you want to skip yeoman prompting, copy compose.json.example into your project folder,
rename it `compose.json` then update it according to your needs.