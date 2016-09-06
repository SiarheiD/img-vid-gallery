<?php
	$dir = $_POST['dir'];
	$files = scandir('../'.$dir);
	$JSON = array();
	for ( $i = 0; $i < count($files); $i++){
		$files[$i] = $dir.$files[$i];
	};
	for ( $i = 0; $i < count($files); $i++){
		$JSON[] = array('type' => 'img', 'url' => $files[$i]);
	};
	$JSON = json_encode($JSON);
	echo $JSON;