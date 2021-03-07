# FNS Electrode, a NodeJS webserver for PHP applications

Electrode is a NodeJS webserver with a PHP subsystem. Electrode can serve static files as fast as possible, and run on-demand PHP scripts.

Electrode is meant to be fast, reliable and unattended (it will automatically update an installed software when needed). Electrode is made to be used with FNS Neutron, but can also (but not recommended to) be used with other software.

## Getting started
The first time you need to run Electrode, you'll need to compile some dependencies:
```plaintext
npm rebuild
```

When you compiled the dependencies, you can start Electrode using NPM:
```plaintext
npm start
```

... or using NodeJS
```plaintext
node index.js
```

Normal startup will start « sharded » processes that will use all your CPU cores. If you have some problems with that or want a less-consuming server, start normally and press a key when the « Press any key to start with sharding disabled » message appears.

> **Important :** There's a `cache` folder, **NEVER DELETE ITS CONTENT** or it will break PHP scripts. Files in the `cache` folder are deleted when needed.

## Requirements
* PHP 7.0 or newer
* The `xdebug` extension (used to get the response headers from PHP)
* `make` and all development libraries
* The NPM package manager