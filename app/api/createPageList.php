<?php 
    $_POST = json_decode(file_get_contents('php://input'), true);
    $newFile = '../../'. $_POST['name'] . '.html';

    if(file_exists($newFiles)){
        header('HTTP/1.0 404 Bad Request');
    } else {
        fopen($newFile, 'w');
    }

    