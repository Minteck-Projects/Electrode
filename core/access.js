const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

module.exports = (filename) => {
    if (fs.existsSync(path.dirname(filename) + "/.htaccess")) {
        try {
            access = fs.readFileSync(path.dirname(filename) + "/.htaccess").toString();
            if (access.trim().includes("##net.minteckprojects.fns.electrode@DenyAccess##")) {
                return false;
            } else {
                return true;
            }
        } catch (e) {
            console.log(chalk.gray(cluster.worker.id + " ") + chalk.yellow("warn:") + " unable to read htaccess from " + path.dirname(filename) + ": " + e.message);
            console.log(e.stack);
            return true;
        }
    } else {
        if (fs.existsSync(path.dirname(path.dirname(filename)) + "/.htaccess")) {
            try {
                access = fs.readFileSync(path.dirname(path.dirname(filename)) + "/.htaccess").toString();
                if (access.trim().includes("##net.minteckprojects.fns.electrode@DenyAccess##")) {
                    return false;
                } else {
                    return true;
                }
            } catch (e) {
                console.log(chalk.gray(cluster.worker.id + " ") + chalk.yellow("warn:") + " unable to read htaccess from " + path.dirname(path.dirname(filename)) + ": " + e.message);
                console.log(e.stack);
                return true;
            }
        } else {
            if (fs.existsSync(path.dirname(path.dirname(path.dirname(filename))) + "/.htaccess")) {
                try {
                    access = fs.readFileSync(path.dirname(path.dirname(path.dirname(filename))) + "/.htaccess").toString();
                    if (access.trim().includes("##net.minteckprojects.fns.electrode@DenyAccess##")) {
                        return false;
                    } else {
                        return true;
                    }
                } catch (e) {
                    console.log(chalk.gray(cluster.worker.id + " ") + chalk.yellow("warn:") + " unable to read htaccess from " + path.dirname(path.dirname(path.dirname(filename))) + ": " + e.message);
                    console.log(e.stack);
                    return true;
                }
            } else {
                return true;
            }
        }
    }
}