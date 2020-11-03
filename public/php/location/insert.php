<?php

	$executionStartTime = microtime(true);

	include("../config.php");
	
	$conn = new mysqli($Host, $User, $Password, $DBname, $Port, $Socket);
	
	include("../queryHandler/unconnected.php");

	$query = 'INSERT INTO `location` (`name`) 
              VALUES("' . $_REQUEST['name'] . '")';

	$result = $conn->query($query);
	
	include("../queryHandler/failure.php");
   
   	$data = [];

	include("../queryHandler/success.php");

?>