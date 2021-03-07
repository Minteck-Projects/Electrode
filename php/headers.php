<?php

function __electrode_end_hooks() {
    global $_PHPID;
    file_put_contents("./cache/HAD_$_PHPID.json", json_encode(xdebug_get_headers(), JSON_PRETTY_PRINT));
}

$__electrode = true;
