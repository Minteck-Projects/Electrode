const fs = require('fs');

module.exports = () => {
    fs.readdir("./cache", (error, files) => {
        if (error) {
            console.log(chalk.gray(cluster.worker.id + " ") + chalk.yellow("warn:") + " unable to cleanup cache: " + error.message);
        } else {
            files.forEach((file) => {
                if (file.startsWith("HAD_")) {
                    fs.unlink("./cache/" + file, () => {});
                }
            })
        }
    })
}