# Icon Library - core

[![Build Status](https://travis-ci.org/ovh-ux/ovh-iconlib-core.svg?branch=master)](https://travis-ci.org/ovh-ux/ovh-iconlib-core)
[![Coverage Status](https://coveralls.io/repos/github/ovh-ux/ovh-iconlib-core/badge.svg?branch=readme)](https://coveralls.io/github/ovh-ux/ovh-iconlib-core?branch=readme)

[![NPM](https://nodei.co/npm/ovh-iconlib-core.png)](https://nodei.co/npm/ovh-iconlib-core/)

## Installation

```sh
npm i --save ovh-iconlib-core
```

## Usage

```js
const iconlib = require('ovh-iconlib-core');
```


```js
let service = new iconlib.services.SvgService();
service.clean('<svg>...</svg>')
    .then(result => {
        console.log(result);
    });
```

## License and copyright

see [`LICENSE`](LICENSE) file
___

# Reference

- iconlib.
    - [services.](#iconlib_services)
        - [SvgService.](#iconlib_services_svgservice)
            - [`Promise` clean(`string` svg)](#iconlib_services_svgservice_clean)
            - [`Promise` list()](#iconlib_services_svgservice_list)
            - [`Promise` store(`Stream` stream , `string` filename)](#iconlib_services_svgservice_store)
            - [`Promise` remove(`string` filename)](#iconlib_services_svgservice_remove)

<a id="iconlib_services"></a>

## services

<a id="iconlib_services_svgservice"></a>

### SvgService

<a id="iconlib_services_svgservice_clean"></a>

#### clean(string svg)

_clean a svg_

> - Parameters:
>    - `string` svg: svg to clean
> - Return a `Promise<string>`

```js
let service = new iconlib.services.SvgService();
service.clean('<svg>...</svg>')
    .then(result => {
        console.log(result);
    });
```

<a id="iconlib_services_svgservice_list"></a>

#### list()

_list files in the storage_

> - Return a `Promise<Array<string>>`

```js
let service = new iconlib.services.SvgService();
service.list()
    .then(files => {
        files.forEach(file => {
            console.log(file);
        });
    });
```

<a id="iconlib_services_svgservice_store"></a>

#### store(Stream stream, string filename)

_put a svg file in the storage_

> - Parameters:
>     - `Stream` stream: file to store
>     - `string` filename: name of the file to store
> - Return a `Promise<FileInfo>`

```js
// get stream
let file = stream.PassThrough();
file.end('dummy content');

let service = new iconlib.services.SvgService();
service.store(file, 'dummy.txt')
    .then(info => {
        console.log(info);
    });
```

<a id="iconlib_services_svgservice_remove"></a>

#### remove(string filename)

_remove a svg file of the storage_

> - Parameters:
>     - `string` filename: name of the file to remove
> - Return a `Promise<boolean>`, `true` if removed, `false` otherwise

```js
let service = new iconlib.services.SvgService();
service.remove(file, 'dummy.txt')
    .then(removed => {
        console.log(removed);
    });
```
