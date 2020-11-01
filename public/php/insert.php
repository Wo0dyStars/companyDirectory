<?php

	$executionStartTime = microtime(true);

    include("config.php");
	
	$conn = new mysqli($Host, $User, $Password, $DBname, $Port, $Socket);
	
	include("queryHandler/unconnected.php");

    // Decode stringified data into interpretable keys
	$_POST = json_decode(file_get_contents("php://input"), true);
	if ( $_POST["avatar"] === "" ) { $_POST["avatar"] = "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"; }
	$query = 'INSERT INTO personnel (firstName, lastName, email, jobTitle, departmentID, expertise, phone, biography, avatar) 
              VALUES("' . $_POST['firstName'] . '", "' . $_POST['lastName'] . '", "' . $_POST['email'] . '", "' . $_POST['jobTitle'] . '", ' . $_POST["departmentID"] . ', "' . $_POST['expertise'] . '", "' . $_POST['phone'] . '", "' . $_POST['biography'] . '", "' . $_POST['avatar'] . '")';

	$result = $conn->query($query);
	
	include("queryHandler/failure.php");

	$data = [];

	include("queryHandler/success.php");

?>