# Icon Library - core

[![Build Status](https://travis-ci.org/ovh-ux/ovh-iconlib-core.svg?branch=master)](https://travis-ci.org/ovh-ux/ovh-iconlib-core)
[![Coverage Status](https://coveralls.io/repos/github/ovh-ux/ovh-iconlib-core/badge.svg?branch=readme)](https://coveralls.io/github/ovh-ux/ovh-iconlib-core?branch=readme)

[![NPM](https://nodei.co/npm/ovh-iconlib-core.png)](https://nodei.co/npm/ovh-iconlib-core/)

## Installation

```sh
npm i --save ovh-iconlib-core
```

Note: __Implementations of [ovh-iconlib-provider-storage](https://github.com/ovh-ux/ovh-iconlib-provider-storage#readme) and [ovh-iconlib-provider-svg-cleaner](https://github.com/ovh-ux/ovh-iconlib-provider-svg-cleaner#readme) must be added as dependencies to your app.__

## Configuration

```yml
# config.yml
connections:
  -
    name: iconlib-store
    authUrl: ${OSS_AUTH_URL} # process.env.OSS_AUTH_URL
    username: ${OSS_USERNAME} # process.env.OSS_USERNAME
    password: ${OSS_PASSWORD} # process.env.OSS_PASSWORD
    region: ${OSS_REGION} # process.env.OSS_REGION
    container: ${OSS_CONTAINER} # process.env.OSS_CONTAINER
svg-cleaner:
  default: svgo
  providers:
    -
      name: svgo
      type: ovh-iconlib-provider-svg-cleaner-svgo
      plugins:
        - ovh-iconlib-provider-svg-cleaner-svgo/lib/plugins/agressiveCollapseGroups
        - ovh-iconlib-provider-svg-cleaner-svgo/lib/plugins/removeClipPaths
        - ovh-iconlib-provider-svg-cleaner-svgo/lib/plugins/cleanStyles
        - svgo/plugins/removeScriptElement
        - svgo/plugins/inlineStyles
        - svgo/plugins/convertStyleToAttrs
storage:
   default: oss
   providers:
     -
       name: oss
       type: ovh-iconlib-provider-storage-oss
       connection: iconlib-store
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
        - [PngService.](#iconlib_services_pngservice)
            - [`Promise` generateFromSvg(`string` svgPath, `Array` dim)](#iconlib_services_pngservice_generatefromsvg)

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

<a id="iconlib_services_pngservice"></a>

### SvgService

<a id="iconlib_services_pngservice_generatefromsvg"></a>

#### generateFromSvg(string svgPath, Array dim = null)

_generate a png file from a svg_

> - Parameters:
>     - `string` svgPath: path of the svg
>     - `Array` dim: dimension of the final png. If null, get dimension from svg ( ```[width, height]``` )
> - Return a `Promise<Buffer>`

```js
let service = new iconlib.services.PngService();
service.generateFromSvg('dummy.svg')
    .then(png => {
        ...
    });
```
