<?php

function __electrode_end_hooks() {
    global $_PHPID;
    $arr = xdebug_get_headers();
    $arr[] = "Cache-Control: private, no-cache, no-store, must-revalidate";
    $arr[] = "Expires: -1";
    $arr[] = "Pragma: no-cache";
    file_put_contents("./cache/HAD_$_PHPID.json", json_encode($arr, JSON_PRETTY_PRINT));
}

$__electrode = true;
