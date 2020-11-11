<?php

	$executionStartTime = microtime(true);

	include("../config.php");

    $conn = new mysqli($Host, $User, $Password, $DBname, $Port, $Socket);
	
	include("../queryHandler/unconnected.php");	

	$_POST = json_decode(file_get_contents("php://input"), true);
	
	$deleteDepartment = 'DELETE FROM `department` WHERE id = ' . $_POST['id']. ";";

	$result = $conn->query($deleteDepartment);
	
	include("../queryHandler/failure.php");

	$data = [];

	include("../queryHandler/success.php");

?>