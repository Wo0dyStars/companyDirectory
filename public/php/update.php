<?php

	$executionStartTime = microtime(true);

    include("config.php");
	
	$conn = new mysqli($Host, $User, $Password, $DBname, $Port, $Socket);
	
	include("queryHandler/unconnected.php");

    $_POST = json_decode(file_get_contents("php://input"), true);
	$query = "UPDATE personnel 
              SET firstname = ?, lastName = ?, email = ?, expertise = ?, phone = ?, biography = ?, experience = ?, jobTitle = ?
              WHERE id = ?";

    $result = $conn->prepare($query);
    $result->bind_param('ssssssisi', $_POST['firstName'], $_POST['lastName'], $_POST['email'], $_POST['expertise'], $_POST['phone'], $_POST['biography'], $_POST['experience'], $_POST['jobTitle'], $_POST['id']);
	$result->execute();
	
	include("queryHandler/failure.php");

	$data = [];

	include("queryHandler/success.php");

?>