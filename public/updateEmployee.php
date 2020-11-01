<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/insertDepartment.php?name=New%20Department&locationID=1

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

    include("config.php");
    
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    header("Access-Control-Allow-Origin: *");
    header('Content-Type: application/json; charset=UTF-8');
	header("Accept: application/json");
    header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
    

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	

    // firstName = "' . $_POST['firstName'] . '", 
    //               lastName = "' . $_POST['lastName'] . '",
    //               email = "' . $_POST['email'] . '",
    // departmentID = ' . $_POST["departmentID"] . ',
    //               expertise = "' . $_POST['expertise'] . '",
    //               phone = "' . $_POST['phone'] . '",
    //               biography = "' . $_POST['biography'] . '"

    // Decode stringified data into interpretable keys
    $_POST = json_decode(file_get_contents("php://input"), true);
    
	$query = "UPDATE personnel 
              SET firstname = ?, lastName = ?, email = ?, expertise = ?, phone = ?, biography = ?, experience = ?, jobTitle = ?
              WHERE id = ?";

    $result = $conn->prepare($query);
    $result->bind_param('ssssssisi', $_POST['firstName'], $_POST['lastName'], $_POST['email'], $_POST['expertise'], $_POST['phone'], $_POST['biography'], $_POST['experience'], $_POST['jobTitle'], $_POST['id']);
	$result->execute();
	
	if (!$result) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];
	
	mysqli_close($conn);

	echo json_encode($output); 

?>