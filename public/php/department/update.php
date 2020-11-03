<?php

	$executionStartTime = microtime(true);

    include("../config.php");
	
	$conn = new mysqli($Host, $User, $Password, $DBname, $Port, $Socket);
	
	include("../queryHandler/unconnected.php");

	$query = "UPDATE department 
              SET `name` = ?, `locationID` = ?
              WHERE id = ?";

    $result = $conn->prepare($query);
    $result->bind_param('sii', $_REQUEST['name'], $_REQUEST['locationID'],   $_REQUEST['id']);
	$result->execute();
	
	include("../queryHandler/failure.php");

	$data = [];

	include("../queryHandler/success.php");

?>