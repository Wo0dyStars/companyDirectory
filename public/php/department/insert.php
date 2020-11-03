<?php

	$executionStartTime = microtime(true);

	include("../config.php");
	
	$conn = new mysqli($Host, $User, $Password, $DBname, $Port, $Socket);
	
	include("../queryHandler/unconnected.php");

	$query = 'INSERT INTO `department` (`name`, `locationID`) 
              VALUES("' . $_REQUEST['name'] . '", "' . $_REQUEST['locationID'] . '")';

	$result = $conn->query($query);
	
	include("../queryHandler/failure.php");
   
   	$data = [];

	include("../queryHandler/success.php");

?>