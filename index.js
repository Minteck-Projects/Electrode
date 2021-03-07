const fs = require('fs');
const chalk = require('chalk');
const progress = require('progress');
global.cluster = require('cluster');

if (require('fs').existsSync("./cache/download.tar")) {
    require('fs').unlinkSync("./cache/download.tar");
}

if (require('fs').existsSync("./download")) {
    require('fs').rmdirSync("./download", {
        recursive: true
    });
}

global.__CLUSTER_CPUSCOUNT = require('os').cpus().length;
global.__SYSTEMROOT = __dirname;
global.__RUNNING = false;
global.__SRUNNING = false;

if (cluster.isMaster) {
    if (fs.existsSync("./public/cms-special")) {
        setTimeout(() => {
            console.log(chalk.blue("info: ") + "updating...");
            p = require('child_process').spawnSync("./shared/updates.sh", [], {
                stdio: 'inherit'
            });
            console.log(chalk.blue("info: ") + "finished");
            if (p.status != 0) {
                console.log(chalk.yellow("warn: ") + "update failed with exit code " + p.status);
            }
            require('./shared/bootstrap.js');
            global.__SRUNNING = true;
        }, 1250)
    } else {
        setTimeout(() => {
            console.log(chalk.blue("info: ") + "downloading Neutron...");
            p = require('child_process').spawnSync("./shared/updates.sh", [], {
                stdio: 'inherit'
            });
            console.log(chalk.blue("info: ") + "finished");
            if (p.status != 0) {
                console.log(chalk.red("error: ") + "failed to download core with exit code " + p.status);
            }
            fs.copyFileSync("./php/headers.php", "./cache/headers.php");
            require('./shared/bootstrap.js');
            global.__SRUNNING = true;
        }, 1250)
    }

    setInterval(() => {
        if (__RUNNING) {
            console.log(chalk.blue("info: ") + "updating...");
            p = require('child_process').spawnSync("./shared/updates.sh", [], {
                stdio: 'inherit'
            });
            console.log(chalk.blue("info: ") + "finished");
            if (p.status != 0) {
                console.log(chalk.yellow("warn: ") + "update failed with exit code " + p.status);
            }
        }
    }, require('./config/updates.json').interval);
} else {
    console.log(chalk.blue("info: ") + `worker #${cluster.worker.id} with pid ${process.pid} started`);
    require('./runtime.js');
}
