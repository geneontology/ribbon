# ribbon
Short form matrix view of all GO annotations for a given gene

## Acknowledgments
- Thanks to Sibyl Gao (@sibyl229) for knowing what to do and how to do it for AGR usage, Josh Goodman for making his code available as a start point, Seth Carbon (@kltm) for bearing with my naive questions, and Chris Mungall (@cmungall) for all the usual fantastic things he does

## Installation
- Make sure node.js is installed - see https://nodejs.org/en/download/

- Once node.js is on your machine then dependent packages need to be brought in. Running `npm install` in the components's root directory will install everything you need for development.
 - Note that you may need to run 'npm install' as sudo.

- To install locally, you need to run:
 - npm run build
 - npm pack
 - point to the .tgz file locally (had many issues with npm link)

## Demo Ribbon Server

- `npm start` will run a local server with the ribbon's demo app at [http://localhost:3000](http://localhost:3000) with hot module reloading.
- To actually see a populated 'ribbon' you will need to provide the resource name and the resource's gene identifier in the URL. That is:  [http://localhost:3000/?subject=MGI:MGI:97490](http://localhost:3000/?subject=MGI:MGI:97490) or [http://localhost:3000/?subject=ZFIN:ZDB-GENE-990415-173](http://localhost:3000/?subject=ZFIN:ZDB-GENE-990415-173)

## Examples
- fly
![img](docs/flyribbon.png)

- zebrafish

![img](docs/zfinribbon.png)

- mouse
![img](docs/mouseribbon.png)

## Build the library
`npm run build` will prepare the assets of the library for publishing to NPM.
