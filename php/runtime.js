const child = require('child_process');
const util = require('util');
const chalk = require('chalk');
const exec = util.promisify(child.exec);

module.exports = async ([file, id]) => {
    startd = new Date();
    try {
        error = undefined;
        var { stdout, stderr } = await exec("php \"" + file.split("\"").join("\\\"") + "\"");
    } catch (e) {
        error = e;
    }
    stopd = new Date();
    diff = stopd - startd;

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