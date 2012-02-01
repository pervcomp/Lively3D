<?php

	$consumerKey = 'your consumer key';
	$consumerSecret = 'your consumer secret';

	require_once 'dropbox.php';

	$dropbox = new Dropbox($consumerKey, $consumerSecret);

	$token = "your token";
	$tokenSecret = "your token secret";
	$dropbox->setOAuthToken($token);
	$dropbox->setOAuthTokenSecret($tokenSecret);
	
	$path = $_GET["path"];
	if ( isset($_GET["path"]) && substr($path, -1 ) != '/' ){
		$path = $path . '/';
	}
	
	$dirs = false;
	if ( isset($_GET["dirs"])){
		if ( $_GET["dirs"] === "true" ){
			$dirs = true;
		}
	}
	
	$response = $dropbox->metadata('/Lively3D/' . $_GET["path"]);
	$contents = $response['contents'];
	
	$filelist = array();
	$root = '/Lively3D/';

	if ( strlen($path) == 1 ){
		$root = '/Lively3D';
	}
	foreach($contents as $file ){
		if ( $file['is_dir'] === $dirs ){
			$name = substr($file['path'], strlen($root . $path));
			$filelist[] = $name;
		}
	}
	
	echo json_encode($filelist);
?>
