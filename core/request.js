const chalk = require('chalk');
const mime = require('mime-types');
const path = require('path');

module.exports = (req, res, post, files) => {
    try {
        res.setHeader("X-Electrode-WorkerID", cluster.worker.id)
        res.setHeader("Server", "Electrode/" + version + " (" + require('os').type() + ")")
        res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.setHeader('Expires', '-1');
	res.setHeader('Pragma', 'no-cache');
        if (req.url.includes('../')) {
            console.log(chalk.gray(cluster.worker.id + " ") + chalk.blue("warn:") + " working around exploit");
            res.writeHead(301, { 'Location': '/index.php' }); 
            res.end();
        } else if (req.url.trim() == '/' || req.url.trim() == '//' || req.url.trim() == '') {
            console.log(chalk.gray(cluster.worker.id + " ") + chalk.blue("warn:") + " working around redirection trap");
            res.writeHead(301, { 'Location': '/index.php' });
            res.end(); 
        } else {
            console.log(chalk.gray(cluster.worker.id + " ") + chalk.green("verb:") + " " + req.method + " " + req.url + " - HTTP/" + req.httpVersion + " - " + req.connection.remoteAddress);

            filename = core.finder(req.url);
            if (filename == null) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                console.log(chalk.gray(cluster.worker.id + " ") + chalk.yellow("warn:") + " not found: " + req.url);
                res.write('<html><head><title>ENOTFOUND - File not found</title></head><body><h1>ENOTFOUND</h1><p>This file couldn\'t be found on the server</p><hr><address>' + config.product.name + ' version ' + version + '</address></body></html>');
                res.end();
            } else {
                if (require('fs').lstatSync(filename).isDirectory()) {
                    res.writeHead(403, { 'Content-Type': 'text/html' });
                    console.log(chalk.gray(cluster.worker.id + " ") + chalk.yellow("warn:") + " is directory: " + req.url);
                    res.write('<html><head><title>EACCES - Permission denied</title></head><body><h1>EACCES</h1><p>Permission to access this file was denied by the server configuration</p><hr><address>' + config.product.name + ' version ' + version + '</address></body></html>');
                    res.end();
                } else {
                    if (core.access(filename)) {
                        if (!filename.endsWith(".php")) {
                            res.setHeader("Cache-Control", "no-cache")
                            require('fs').readFile(filename, (error, file) => {
                                if (error) {
                                    res.writeHead(500, { 'Content-Type': 'text/html' });
                                    res.write('<html><head><title>' + error.code + ' - Internal error</title></head><body><h1>' + error.code + '</h1><p>An internal server error ocurred while trying to give back the file</p><hr><address>' + config.product.name + ' version ' + version + '</address></body></html>');
                                    res.end();
                                    console.log(chalk.gray(cluster.worker.id + " ") + chalk.red("error:") + " while loading file: " + error.message);
                                } else {
                                    ext = path.extname(filename);
                                    if (ext === ".css") {
                                        mimet = "text/css"
                                    } else if (ext === ".js") { 
                                        mimet = "application/javascript"
                                    } else {
                                        mimet = mime.contentType(ext);
                                    }
				    res.writeHead(200, { 'Content-Type': mimet, 'Content-Size': file.toString().length });
                                    res.end(file);	                            
                                }
                            })
                        } else {
                            php.runtime(php.cache(req, res, filename, post, files)).then((phpc) => {
                                if (phpc.error == null) {
                                    if (require('fs').existsSync("./cache/HAD_" + phpc.id + ".json")) {
                                        try {
                                            headers = JSON.parse(require('fs').readFileSync("./cache/HAD_" + phpc.id + ".json"));
                                            hlist = {};
                                            headers.forEach(h => {
                                                p = h.split(":");
                                                n = p[0];
                                                p.shift();
                                                v = p.join(":");
                                                hlist[n.toLowerCase()] = v;
                                            })
                                            if (typeof hlist["content-type"] == "undefined") {
                                                hlist["content-type"] = "text/html";
                                            }
                                            if (typeof hlist["location"] != "undefined") {
                                                res.writeHead(301, hlist);
                                            } else {
                                                res.writeHead(200, hlist);
                                            }
                                        } catch (e) {
                                            console.log(chalk.gray(cluster.worker.id + " ") + chalk.red("error:") + " while loading php headers: " + e.message);
                                            console.log(e.stack);
                                            res.writeHead(500, { 'Content-Type': 'text/html' });
                                            res.write('<html><head><title>' + e.name + ' - post-PHP error</title></head><body><h1>' + e.name + '</h1><p>Unable to process PHP headers</p><hr><address>' + config.product.name + ' version ' + version + '</address></body></html>');
                                            res.end();
                                        }
                                    }

                                    res.write(phpc.content);
                                    res.end();
                                    core.headClean();
                                } else {
                                    res.writeHead(500, { 'Content-Type': 'text/html' });
                                    console.log(chalk.gray(cluster.worker.id + " ") + chalk.red("error:") + " while running php: " + phpc.error.message);
                                    console.log(phpc.error.stack);
                                    res.write('<html><head><title>' + phpc.error.name + ' - PHP error</title></head><body><h1>' + phpc.error.name + '</h1><p>The PHP integration didn\'t fulfill the request correctly:</p><pre>' + phpc.stderr + '</pre><pre>' + phpc.error.message.split("\n").join("<br>") + '</pre><hr><address>' + config.product.name + ' version ' + version + '</address></body></html>');
                                    res.end();
                                }
                            });
                        }
                    } else {
                        res.writeHead(403, { 'Content-Type': 'text/html' });
                        console.log(chalk.gray(cluster.worker.id + " ") + chalk.yellow("warn:") + " denied by .htaccess: " + req.url);
                        res.write('<html><head><title>EACCES - Permission denied</title></head><body><h1>EACCES</h1><p>Permission to access this file was denied by the server configuration</p><hr><address>' + config.product.name + ' version ' + version + '</address></body></html>');
                        res.end();
                    }
                }
            }
        }
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.write('<html><head><title>' + error.name + ' - Internal error</title></head><body><h1>' + error.name + '</h1><p>An internal server error ocurred while trying to give back the file</p><hr><address>' + config.product.name + ' version ' + version + '</address></body></html>');
        console.log(chalk.gray(cluster.worker.id + " ") + chalk.red("error:") + " " + error.name + ": " + error.message);
        console.log(error.stack);
        res.end();
    }
}
