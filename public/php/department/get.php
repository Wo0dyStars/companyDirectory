<?php

	$executionStartTime = microtime(true);

	include("../config.php");
	
	$conn = new mysqli($Host, $User, $Password, $DBname, $Port, $Socket);
	
	include("../queryHandler/unconnected.php");

	$query = "
        SELECT id, name, locationID
        FROM department
	";

	$result = $conn->query($query);
	
	include("../queryHandler/failure.php");
   
   	$data = [];
	while ($row = mysqli_fetch_assoc($result)) {
		array_push($data, $row);
	}

	include("../queryHandler/success.php");

?>