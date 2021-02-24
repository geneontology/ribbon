# ribbon (DEPRECATED)
Short form matrix view of all GO annotations for a given gene

This REACT version of the ribbon has been deprecated. Users should now use or migrate to the Web Component version of the GO ribbon, richer in functionalities, and easier to install: 

https://github.com/geneontology/wc-ribbon/tree/master/wc-go-ribbon


## Installation
- Once node.js is on your machine then dependent packages need to be brought in. Running `npm install` in the components's root directory will install everything you need for development.
 - Note that you may need to run 'npm install' as sudo.

### Deployment
```
    npm install
    npm run build 
```
   
## Demo Ribbon Server

- `npm start` will run a local server with the ribbon's demo app at [http://localhost:3000](http://localhost:3000) with hot module reloading.
- To actually see a populated 'ribbon' you will need to provide the resource name and the resource's gene identifier in the URL. That is:  [http://localhost:3000/?subject=MGI:MGI:97490](http://localhost:3000/?subject=MGI:MGI:97490) or [http://localhost:3000/?subject=ZFIN:ZDB-GENE-990415-173](http://localhost:3000/?subject=ZFIN:ZDB-GENE-990415-173)

## Integration


Integration is demonstrated in the [demo package](https://github.com/geneontology/ribbon/blob/master/demo/src/index.js).



    import React from 'react';
    import ReactDOM from 'react-dom';
    ... 
    ReactDOM.render(<Demo/>, document.getElementById('demo'));


With the [Demo Component](https://github.com/geneontology/ribbon/blob/master/demo/src/Demo.js) instantiating all of the lower components. 

If not running react directly (or not wanting to load it via npm), you can import the libraries directly :

    <script src="https://unpkg.com/react@15.6.1/dist/react.js"></script>
    <script src="https://unpkg.com/react-dom@15.6.1/dist/react-dom.js"></script>

Which will allow you to do as above. 

## Examples
- fly
![img](docs/flyribbon.png)

- zebrafish

![img](docs/zfinribbon.png)

- mouse
![img](docs/mouseribbon.png)

## Build the library
`npm run build` will prepare the assets of the library for publishing to NPM.
