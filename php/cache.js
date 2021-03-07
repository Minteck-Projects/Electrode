const uuid = require('uuid');
const fs = require('fs');
const url = require('url');
const path = require('path');
const os = require('os');

function addPhpServerVariable(server, name, value) {
    if (typeof value == "string") {
        return server + "\n$_SERVER['" + name.split("'").join("\\'") + "'] = \"" + value.split("\"").join("\\\"") + "\";";
    } else {
        return server + "\n$_SERVER['" + name.split("'").join("\\'") + "'] = " + value + ";";
    }
}

module.exports = (req, res, file, post, files) => {
    cid = uuid.v4();
    fid = "PHP_" + cid;
    parsed = url.parse(req.url, true);

    content = "<?php\n\n$_PHPID = \"" + cid + "\";\nrequire \"headers.php\";\n\n"
    + "\n$oldsrv = $_SERVER; $_SERVER = [];";
    + "\n$__electrode_version = \"" + version + "\"";
    content = addPhpServerVariable(content, "PHP_SELF", path.resolve(file));
    content = addPhpServerVariable(content, "GATEWAY_INTERFACE", "CGI/1.1");
    content = addPhpServerVariable(content, "SERVER_ADDR", Object.values(require('os').networkInterfaces()).reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i.family==='IPv4' && !i.internal && i.address || []), [])), [])[0]);
    content = addPhpServerVariable(content, "SERVER_NAME", os.hostname());
    content = addPhpServerVariable(content, "SERVER_SOFTWARE", config.product.name);
    content = addPhpServerVariable(content, "SERVER_PROTOCOL", "HTTP/" + req.httpVersion);
    content = addPhpServerVariable(content, "REQUEST_METHOD", req.method);
    content = addPhpServerVariable(content, "REQUEST_TIME", REQUEST_START);
    content = addPhpServerVariable(content, "REQUEST_TIME_FLOAT", REQUEST_START_FLOAT);
    content = addPhpServerVariable(content, "QUERY_STRING", parsed.search);
    content = addPhpServerVariable(content, "DOCUMENT_ROOT", path.resolve("./public"));
    if (typeof req.headers["accept"] != "undefined") {
        content = addPhpServerVariable(content, "HTTP_ACCEPT", req.headers["accept"]);
    }
    if (typeof req.headers["accept-charset"] != "undefined") {
        content = addPhpServerVariable(content, "HTTP_ACCEPT_CHARSET", req.headers["accept-charset"]);
    }
    if (typeof req.headers["accept-encoding"] != "undefined") {
        content = addPhpServerVariable(content, "HTTP_ACCEPT_ENCODING", req.headers["accept-encoding"]);
    }
    if (typeof req.headers["accept-language"] != "undefined") {
        content = addPhpServerVariable(content, "HTTP_ACCEPT_LANGUAGE", req.headers["accept-language"]);
    }
    if (typeof req.headers["connection"] != "undefined") {
        content = addPhpServerVariable(content, "HTTP_CONNECTION", req.headers["connection"]);
    }
    if (typeof req.headers["host"] != "undefined") {
        content = addPhpServerVariable(content, "HTTP_HOST", req.headers["host"]);
    }
    content = addPhpServerVariable(content, "HTTP_REFERER", req.url);
    if (typeof req.headers["user-agent"] != "undefined") {
        content = addPhpServerVariable(content, "HTTP_USER_AGENT", req.headers["user-agent"]);
    }
    content = addPhpServerVariable(content, "REMOTE_ADDR", req.connection.remoteAddress);
    content = addPhpServerVariable(content, "REMOTE_PORT", req.connection.remotePort);
    content = addPhpServerVariable(content, "SCRIPT_FILENAME", path.resolve(file));
    content = addPhpServerVariable(content, "SERVER_ADMIN", config.network.admin);
    content = addPhpServerVariable(content, "SERVER_PORT", config.network.port);
    content = addPhpServerVariable(content, "SERVER_SIGNATURE", "<address>" + config.product.name + " version " + version + "</address>");
    content = addPhpServerVariable(content, "PATH_TRANSLATED", path.resolve(file));
    content = addPhpServerVariable(content, "SCRIPT_NAME", file.substr("./public/".length));
    content = addPhpServerVariable(content, "REQUEST_URI", parsed.pathname);
    content = content + "\n$_FILES = [];";
    content = content + "\n$_POST = [];";
    content = content + "\n$_GET = [];";
    Object.keys(parsed.query).forEach((key) => {
        content = content + "\n$_GET[\"" + key.split("\"").join("\\\"").split("$").join("\\\$") + "\"] = \"" + parsed.query[key].split("\"").join("\\\"").split("$").join("\\\$") + "\";"
    })
    Object.keys(post).forEach((key) => {
        content = content + "\n$_POST[\"" + key.split("\"").join("\\\"").split("$").join("\\\$") + "\"] = \"" + post[key].split("\"").join("\\\"").split("$").join("\\\$") + "\";"
    })
    if (typeof files == "object") {
        Object.keys(files).forEach((key) => {
            content = content + "\n$_FILES[\"" + key.split("\"").join("\\\"").split("$").join("\\\$") + "\"] = ['name' => \"" + files[key]["name"].split("\"").join("\\\"") + "\",'type' => \"" + files[key]["type"].split("\"").join("\\\"") + "\",'tmp_name' => \"" + files[key]["path"].split("\"").join("\\\"").split("$").join("\\\$") + "\",'error' => 0,'size' => " + files[key]["size"] + "];"
        })
    }
    cookies = core.cookies(req);
    Object.keys(cookies).forEach((key) => {
        content = content + "\n$_COOKIE[\"" + key.split("\"").join("\\\"").split("$").join("\\\$") + "\"] = \"" + cookies[key].split("\"").join("\\\"").split("$").join("\\\$") + "\";"
    })
    content = content + "\nrequire_once \"" + file.split("\"").join("\\\"") + "\";\n\n__electrode_end_hooks();";

    fs.writeFileSync("./cache/" + fid + ".php", content);
    return [
        "./cache/" + fid + ".php",
        cid
    ];
}
