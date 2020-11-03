<?php

	$executionStartTime = microtime(true);

    include("../config.php");
	
	$conn = new mysqli($Host, $User, $Password, $DBname, $Port, $Socket);
	
	include("../queryHandler/unconnected.php");

	$query = "UPDATE `location` 
              SET `name` = ?
              WHERE id = ?";

    $result = $conn->prepare($query);
    $result->bind_param('si', $_REQUEST['name'], $_REQUEST['id']);
	$result->execute();
	
	include("../queryHandler/failure.php");

	$data = [];

	include("../queryHandler/success.php");

?>