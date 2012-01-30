<?php

$consumerKey = 'your consumer key';
$consumerSecret = 'your consumer secret';

require_once 'dropbox.php';

$dropbox = new Dropbox($consumerKey, $consumerSecret);

header('Content-Type: text/plain');

$tokens = $dropbox->token('email address', 'password'); 

print_r($tokens)
?>
