<?php
if (get_magic_quotes_gpc()) {
    $process = array(&$_GET, &$_POST, &$_COOKIE, &$_REQUEST);
    while (list($key, $val) = each($process)) {
        foreach ($val as $k => $v) {
            unset($process[$key][$k]);
            if (is_array($v)) {
                $process[$key][stripslashes($k)] = $v;
                $process[] = &$process[$key][stripslashes($k)];
            } else {
                $process[$key][stripslashes($k)] = stripslashes($v);
            }
        }
    }
    unset($process);
}
?>

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

$target_path = 'uploadedfiles/';

$filename = $_POST["name"];
$path = '';

if ( isset($_POST["path"]) ){
	$path = $_POST["path"];
	list($root) = explode("/", $path);
	if (!is_dir('uploadedfiles/' . $path )){
		mkdir('uploadedfiles/' . $path, 0777, true);
		chmod_R('uploadedfiles/' . $root, 0777);
	}
	
}

$file = fopen($target_path . $path . '/' . $filename, 'w');
fwrite($file, $_POST["file"]);
fclose($file);
chmod($target_path . $path . '/' . $filename, 0666);

$consumerKey = 'your consumer key';
$consumerSecret = 'your consumer secret';


require_once 'dropbox.php';

$dropbox = new Dropbox($consumerKey, $consumerSecret);

$token = "your token";
$tokenSecret = "your token secret";

$dropbox->setOAuthToken($token);
$dropbox->setOAuthTokenSecret($tokenSecret);

$dropbox->FilesPost('Lively3D/' . $path , $target_path . $path . '/' . $filename); 

?>

