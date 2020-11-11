<?php

	$executionStartTime = microtime(true);

	include("../config.php");
	
	$conn = new mysqli($Host, $User, $Password, $DBname, $Port, $Socket);
	
	include("../queryHandler/unconnected.php");

	if ($_SERVER['REQUEST_METHOD'] === 'POST') {
		$_POST = json_decode(file_get_contents("php://input"), true);
		$trimmedName = trim( $_POST["name"] );
		$trimmedID = trim( $_POST["locationID"] );

		if ( !empty( $trimmedName ) && !empty( $trimmedID ) ) {
			$query = 'INSERT INTO `department` (`name`, `locationID`) 
				VALUES("' .$trimmedName. '", "' .$trimmedID. '")';

			$result = $conn->query($query);
			
			include("../queryHandler/failure.php");
		
			$data = [];
			$data["index"] = $conn->insert_id;

			include("../queryHandler/success.php");
		}
	}

?>