const http = require('http');
const https = require('https');
const chalk = require('chalk');
const fs = require('fs');
const tar = require('tar-fs');
const ProgressBar = require('progress');
var ncp = require('ncp').ncp;

ncp.limit = 4;

function erase(dir) {
    if (fs.existsSync("./public/" + dir)) {
        try {
            fs.rmdirSync("./public/" + dir, { recursive: true })
        } catch (e) {
            console.log(chalk.yellow("warn: ") + "unable to delete folder " + dir);
        }
    }
}

function erasef(file) {
    if (fs.existsSync("./public/" + file)) {
        try {
            fs.unlinkSync("./public/" + file)
        } catch (e) {
            console.log(chalk.yellow("warn: ") + "unable to delete file " + file);
        }
    }
}

module.exports = () => {
    console.log(chalk.green("verb: ") + "loading update config...");
    conf = require('../config/updates.json');

    if (conf.check.ssl) {
        lib = https;
    } else {
        lib = http;
    }

    const options = {
        hostname: conf.check.host,
        port: conf.check.port,
        path: conf.check.path,
        method: 'GET'
    }

    data = "";

    const req = lib.request(options, res => {
        if (res.statusCode != 200) {
            console.log(chalk.yellow("warn: ") + "unable to check for updates: code " + res.statusCode);
            global.__RUNNING = true;
            if (!__SRUNNING) { require('./bootstrap.js'); global.__SRUNNING = true; }
            return;
        }
        
        res.on('data', d => {
            data = data + d;
        })
        
        res.on('end', () => {
            trimmed = data.trim().split("-")[0]
            console.log(chalk.blue("info: ") + "latest version: " + trimmed);
            if (fs.existsSync("./public/api/version")) {
                current = fs.readFileSync("./public/api/version").toString().trim().split("-")[0];
                console.log(chalk.blue("info: ") + "installed version: " + current);
            } else {
                console.log(chalk.yellow("warn: ") + "the Neutron stack doesn't appears to be installed");
                current = "0";
            }
            if (current == trimmed) {
                console.log(chalk.blue("info: ") + "up to date, starting webserver...");
                global.__RUNNING = true;
                if (!__SRUNNING) { require('./bootstrap.js'); global.__SRUNNING = true; }
                return;
            } else {
                console.log(chalk.blue("info: ") + "updating to " + trimmed + "...");
                
                if (conf.update.ssl) {
                            lib = https;
                        } else {
                            lib = http;
                        }
                        
                        var req = lib.request({
                            host: conf.update.host,
                            port: conf.update.port,
                            path: conf.update.path
                        });
                        console.log(chalk.blue("info: ") + "starting download...");

                        file = fs.createWriteStream("./cache/download.tar.gz");
                           
                        req.on('response', function(res){
                            res.pipe(file);

                            console.log();
	                    console.log(chalk.blue("info: ") + "writing on disk...");
                           
                            res.on('end', function () {
                                console.log("\n" + chalk.blue("info: ") + "verifying update...");
                                fs.mkdirSync("./download");
                                fs.createReadStream("./cache/download.tar").pipe(tar.extract("./download", {
                                    finish: () => {
                                        fdir = fs.readdirSync("./download")[0];
                                        dfile = fs.readdirSync("./download/" + fdir);
                                        dfile.forEach((f) => {
                                            fs.renameSync("./download/" + fdir + "/" + f, "./download/" + f);
                                        })
                                        fs.rmdirSync("./download/" + fdir);
                                        erase("/api");
                                        erase("/cms-special");
                                        erase("/widgets");
                                        erase("/resources/css");
                                        erase("/resources/fonts");
                                        erase("/resources/i18n");
                                        erase("/resources/image");
                                        erase("/resources/js");
                                        erase("/resources/lib");
                                        erase("/resources/private");
                                        erasef("/resources/.htaccess");
                                        erasef("/index.php");
                                        console.log(chalk.blue("info: ") + "installing update...");
                                        ncp("./download", "./public", function (err) {
                                            if (err) {
                                                console.log(chalk.yellow("warn: ") + "unable to install update: " + err.message);
                                                global.__RUNNING = true;
                                                if (!__SRUNNING) { require('./bootstrap.js'); global.__SRUNNING = true; }
                                                return;
                                            }
                                            console.log(chalk.blue("info: ") + "update installed, starting webserver...");
                                            global.__RUNNING = true;
                                            if (!__SRUNNING) { require('./bootstrap.js'); global.__SRUNNING = true; }
                                            return;
                                        });
                                    }
                                }));
                            });
                        });
            }
        })
    })
      
    req.on('error', error => {
        console.log(chalk.yellow("warn: ") + "unable to check for updates: " + error.message);
        global.__RUNNING = true;
        if (!__SRUNNING) { require('./bootstrap.js'); global.__SRUNNING = true; }
        return;
    })
      
    req.end()
}
