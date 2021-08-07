const fs = require('fs');

function cacheClean(dir) {
    if (fs.statSync(dir).isDirectory()) {
        contents = fs.readdirSync(dir);
        for (item of contents) {
            cacheClean(dir + "/" + item);
        }
    } else if (fs.statSync(dir).isFile()) {
        if (dir.endsWith("ELECTRODECACHE~.php")) {
            // fs.unlinkSync(dir);
        }
    }
}

module.exports = () => {
    cacheClean(publicDir);
}