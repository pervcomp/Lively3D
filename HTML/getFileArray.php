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

if ( isset($_GET['names']) ){
	$names = $_GET['names'];
}
else{
	$names = '';
}


if (strlen($path) == 1 ){
	$path = '';
}



$prevName = "NONEXISTING";
$prevFolder = "NONEXISTING";
foreach( $names as $name ){
	if ( $prevName != $name ){
		
		$prevName = $name;
		if ( !strpos($name, "/") ){
			$folder = "";
			$filename = $name;
			
		}
		else{
			list($folder, $filename) = explode("/", $name); 
		}
		if ( $folder != $prevFolder ){
			$prevFolder = $folder;
			$response = $dropbox->metadata('/Lively3D/' . $path . $folder);
			$contents = $response['contents'];
			
		}
	}
	
	foreach( $contents as $entry ){
		if ( $entry['path'] == '/Lively3D/' . $path . $name ){
			$time = strtotime($entry['modified']);

			if ( !file_exists('dropboxfiles/' . $path . $name) || $time > filemtime('dropboxfiles/' . $path . $name) ){
				$fileresponse  = $dropbox->FilesGet('Lively3D/' . $path . $name);
				$file = base64_decode($fileresponse['data']);
				
				if ( isset($_GET["JSON"]) && $_GET["JSON"] == true){
					$file = json_encode($file);
				}
				
				list($root, $tmp) = explode("/", $path);
				if (!is_dir('dropboxfiles/' . $path . $folder)){
					mkdir('dropboxfiles/' . $path . $folder, 0777, true);
					chmod_R('dropboxfiles/' . $root, 0777);
				}
				
				$localfile = fopen('dropboxfiles/' . $path . $name, 'w');
				fwrite($localfile, $file);
				fclose($localfile);
				chmod('dropboxfiles/' . $path . $name, 0666);
			}
			if ( strlen(dirname($_SERVER['PHP_SELF'])) == 1 ){
				$result[] = "/dropboxfiles/" . $path . $name;
			}
			else{
				$result[] = dirname($_SERVER['PHP_SELF']). "/dropboxfiles/" . $path . $name;
			}
		}
	}
	
}

echo json_encode($result);
?>
