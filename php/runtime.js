const child = require('child_process');
const util = require('util');
const chalk = require('chalk');
const fs = require('fs');
const exec = util.promisify(child.exec);

module.exports = async ([file, id]) => {
    startd = new Date();
    try {
        error = undefined;
        if (require('os').platform() === "win32") {
            var { stdout, stderr } = await exec("runtime\\php.exe \"" + file.split("\"").join("\\\"") + "\"");
        } else {
            var { stdout, stderr } = await exec("php \"" + file.split("\"").join("\\\"") + "\"");
        }
    } catch (e) {
        error = e;
    }
    stopd = new Date();
    diff = stopd - startd;

    if (fs.existsSync(file + ".ELECTRODECACHE~.php")) {
        fs.unlinkSync(file + ".ELECTRODECACHE~.php");
    }

    require('../core/cacheClean')();

    console.log(chalk.gray(cluster.worker.id + " ") + chalk.blueBright("php:") + " total run time: " + diff + "ms");

    returnobj = {error: null, content: null, stderr: null, id: id};

    if (error) {
        returnobj.error = error;
        returnobj.stderr = stderr;
    } else {
        php.cleanup()
        returnobj.content = stdout;
        returnobj.stderr = stderr;
    }

    return returnobj;
}