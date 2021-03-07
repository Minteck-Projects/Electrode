const http = require('http');
const chalk = require('chalk');
const qs = require('querystring');
const formidable = require('formidable'); 

global.core = {
    'finder': require('./core/finder.js'),
    'access': require('./core/access.js'),
    'request': require('./core/request.js'),
    'headClean': require('./core/headClean.js'),
    'cookies': require('./core/cookies.js'),
}

global.php = {
    'runtime': require('./php/runtime.js'),
    'cache': require('./php/cache.js'),
    'cleanup': require('./php/cleanup.js'),
}

global.version = require('./package.json').version;

try {
    global.config = {
        'network': require('./config/network.json'),
        'product': require('./config/product.json'),
    }
} catch (e) {
    console.error(chalk.gray(cluster.worker.id + " ") + chalk.red("error:") + " invalid config: " + e.message);
    process.exit(2);
}

var server = http.createServer(function (req, res) {
    global.REQUEST_START = Math.floor(new Date() / 1000)
    global.REQUEST_START_FLOAT = new Date() / 1000
    try {
        if (req.method == 'POST') {
            var form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/html' });
                    res.write('<html><head><title>' + error.name + ' - Internal error</title></head><body><h1>' + error.name + '</h1><p>Unable to process received data</p><hr><address>' + config.product.name + ' version ' + version + '</address></body></html>');
                    console.log(chalk.gray(cluster.worker.id + " ") + chalk.red("error:") + " " + error.name + ": " + error.message);
                    console.log(error.stack);
                    res.end();
                } else {
                    core.request(req, res, fields, files);
                }
            });
        } else {
            var post = {};
            core.request(req, res, post);
        }
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.write('<html><head><title>' + error.name + ' - Internal error</title></head><body><h1>' + error.name + '</h1><p>An internal server error ocurred while trying to give back the file</p><hr><address>' + config.product.name + ' version ' + version + '</address></body></html>');
        console.log(chalk.gray(cluster.worker.id + " ") + chalk.red("error:") + " " + error.name + ": " + error.message);
        console.log(error.stack);
        res.end();
    }
});

server.listen(config.network.port);

console.log(chalk.gray(cluster.worker.id + " ") + chalk.blue("info:") + " server listening on port " + config.network.port)