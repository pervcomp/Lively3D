<?php

function chmod_R($path, $filemode) { 
    if (!is_dir($path))
       return chmod($path, $filemode);

    $dh = opendir($path);
    while ($file = readdir($dh)) {
        if($file != '.' && $file != '..') {
            $fullpath = $path.'/'.$file;
            if(!is_dir($fullpath)) {
              if (!chmod($fullpath, $filemode))
                 return FALSE;
            } else {
              if (!chmod_R($fullpath, $filemode))
                 return FALSE;
            }
        }
    }
 
    closedir($dh);
    
    if(chmod($path, $filemode))
      return TRUE;
    else 
      return FALSE;
}

$consumerKey = 'your consumer key';
$consumerSecret = 'your consumer secret';

require_once 'dropbox.php';

$dropbox = new Dropbox($consumerKey, $consumerSecret);

$token = "your token";
$tokenSecret = "your token secret";

$dropbox->setOAuthToken($token);
$dropbox->setOAuthTokenSecret($tokenSecret);

if ( isset($_GET['path']) ){
	$path = $_GET['path'];
}
else{
	$path = '';
}

if ( isset($_GET['name']) ){
	$name = $_GET['name'];
}
else{
	$name = '';
}
$response = $dropbox->FilesGet('GLGE/' . $path . $name);

$file = base64_decode($response['data']);

if ( isset($_GET["JSON"]) && $_GET["JSON"] == true){
	$file = json_encode($file);
}


list($root) = explode("/", $path);
if (!is_dir('dropboxfiles/' . $path )){
	mkdir('dropboxfiles/' . $path, 0777, true);
	chmod_R('dropboxfiles/' . $root, 0777);
}


$localfile = fopen('dropboxfiles/' . $path . $name, 'w');
fwrite($localfile, $file);
fclose($localfile);
chmod('dropboxfiles/' . $path . $name, 0666);

header('Content-Type: text/plain' );

if ( strlen(dirname($_SERVER['PHP_SELF'])) == 1 ){
	echo "/dropboxfiles/" . $path . $name;
}
else{
	echo dirname($_SERVER['PHP_SELF']) . "/dropboxfiles/" . $path . $name;
}
?>
