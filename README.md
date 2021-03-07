# FNS Electrode, a NodeJS webserver for PHP applications

Electrode is a NodeJS webserver with a PHP subsystem. Electrode can serve static files as fast as possible, and run on-demand PHP scripts.

Electrode is meant to be fast, reliable and unattended (it will automatically update an installed software when needed). Electrode is made to be used with FNS Neutron, but can also (but not recommended to) be used with other software.

> Electrode and Neutron can only work on Linux servers. To use it on Windows servers, please use WSL 2 and follow instructions in [Windows Setup](#Windows_Setup)

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

Electrode will start in threaded mode (one thread per CPU core) for optimal performance.

> **Important :** There's a `cache` folder, **NEVER DELETE ITS CONTENT** or it will break PHP scripts. Files in the `cache` folder are automatically deleted by Electrode.

## Requirements
* NodeJS 12 or newer
* PHP 7.4 or newer
* The `xdebug` extension (used to get the response headers from PHP)
* `make` and all development libraries
* The NPM package manager

## Windows Setup
As said earlier, Electrode and Neutron can't run on Windows servers. If you want to use a Windows server, you can use WSL.

> Before continuing, please note that using a Windows server in a production environement is really discouraged, as Neutron asn't been extensively tested through WSL.

1. First, [install WSL](https://docs.microsoft.com/en-us/windows/wsl/install-win10) by following the Microsoft documentation
> Don't miss the part about upgrading to WSL 2, it is VERY important
2. Install `php` (version 7.4 or later), `php-xdebug`, `nodejs` (version 12 or later), `npm` and `make`.
> On Debian or Ubuntu, you would install with
>
> ```sudo apt install php php-xdebug nodejs npm make build-essential```
3. Download and extract Electrode on your WSL
4. Follow the instructions in [Getting started](#Getting_started)