<?php

	$executionStartTime = microtime(true);

	include("../config.php");

    $conn = new mysqli($Host, $User, $Password, $DBname, $Port, $Socket);
	
	include("../queryHandler/unconnected.php");	

	$_POST = json_decode(file_get_contents("php://input"), true);

	$deleteLocation = "DELETE FROM `location` WHERE id = " . $_POST['id'] . ";";
	$conn->query($deleteLocation); 
	
	$deleteDepartments = "DELETE FROM `department` WHERE locationID = " . $_POST['id']. ";";
	$result = $conn->query($deleteDepartments);
	
	include("../queryHandler/failure.php");

	$data = [];

	include("../queryHandler/success.php");

?>