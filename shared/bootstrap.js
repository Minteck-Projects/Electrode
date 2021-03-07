const chalk = require('chalk');

for (let i = 0; i < __CLUSTER_CPUSCOUNT; i++) {
    cluster.fork();
}

cluster.on('exit', (worker, code, signal) => {
    console.log(chalk.yellow("warn: ") + `worker #${worker.id} with pid ${worker.process.pid} died with code ${code}, signal ${signal}`);
    cluster.fork();
});