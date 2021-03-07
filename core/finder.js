const fs = require('fs');
const url = require('url');

/**
 * @param {string} url 
 */
module.exports = (efs) => {
    cfs = url.parse(efs, true).pathname;
    if (fs.existsSync("./public/" + cfs) && !fs.lstatSync("./public/" + cfs).isDirectory()) {
        return "./public/" + cfs;
    } else if (fs.existsSync("./public/" + cfs + "/index.php")) {
        return "./public/" + cfs + "/index.php";
    } else if (fs.existsSync("./public/" + cfs + "/index.html")) {
        return "./public/" + cfs + "/index.html";
    } else if (fs.existsSync("./public/" + cfs)) {
        return "./public/" + cfs;
    } else if (cfs.endsWith(".htaccess")) {
        return null;
    } else {
        return null;
    }
}