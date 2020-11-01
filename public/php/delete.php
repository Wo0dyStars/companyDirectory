<?php

	$executionStartTime = microtime(true);

	include("config.php");

    $conn = new mysqli($Host, $User, $Password, $DBname, $Port, $Socket);
	
	include("queryHandler/unconnected.php");	

    $_POST = json_decode(file_get_contents("php://input"), true);
	$query = 'DELETE FROM personnel WHERE id = ' . $_POST['id'];

	$result = $conn->query($query);
	
	include("queryHandler/failure.php");

	$data = [];

	include("queryHandler/success.php");

?>