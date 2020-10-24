# Installation

## install global deps in order to make this generator working


```bash

npm install -g yo @microsoft/rush

```

## install locally

```bash

cd generator-starter-kit

npm install

npm link

```

## use the main generator

```bash

cd /my-project

yo starter-kit

```

  # Sub-generators

Currently we have a generator for React and another one for Express.

## call sub-generators

```bash

yo starter-kit:react # or `yo starter-kit:express`

```

## pass arguments and options

```bash

yo starter-kit:react my-app-name --npm --sentry --ts

```

# React sub-generator

### arguments

|argument|description |
|--|--|
| applicationName | the name of the application you would install |

### options

|option|description |
|--|--|
|ts | use typescript |
| sentry | use sentry |
| npm | launch npm install & build after the process |


# Express sub-generator

### arguments

|argument|description |
|--|--|
| applicationName | the name of the application you would install |

### options

|option|description |
|--|--|
|ts | use typescript |
| npm | launch npm install & build after the process |

# Configuration

> If you want to skip yeoman prompting, copy compose.json.example into your project folder, rename it `compose.json` then update it according to your needs.