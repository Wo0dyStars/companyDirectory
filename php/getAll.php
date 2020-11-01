<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/getAll.php

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');
	header("Accept: application/json");
    header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Origin: *");

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

	$WHERE = "";
	$INDEX = 0;
	if ( isset($_REQUEST["id"]) ) { $WHERE .= "p.id = '".$_REQUEST["id"]."'"; }
	if ( isset($_REQUEST["department"]) ) { $WHERE .= "d.name = '".$_REQUEST["department"]."'"; $INDEX++; }
	if ( isset($_REQUEST["location"]) ) { 
		if ( $INDEX > 0 ) { $WHERE .= " AND "; }
		
		$WHERE .= " l.name = '".$_REQUEST["location"]."'"; 
		$INDEX++;
	}
	if ( isset($_REQUEST["keyWord"]) ) {
		if ( $INDEX > 0 ) { $WHERE .= " AND "; }
		
		$WHERE .= " ( p.firstName LIKE '%".$_REQUEST["keyWord"]."%' OR
					  p.lastName LIKE '%".$_REQUEST["keyWord"]."%' OR
					  p.jobTitle LIKE '%".$_REQUEST["keyWord"]."%' OR
					  p.expertise LIKE '%".$_REQUEST["keyWord"]."%' OR
					  p.biography LIKE '%".$_REQUEST["keyWord"]."%' )";
	}

	$ORDER_BY = "";
	if ( isset($_REQUEST["orderby"]) ) { $ORDER_BY = $_REQUEST["orderby"]; }

	$ORDER_DIRECTION = "ASC";
	if ( isset($_REQUEST["orderdir"]) ) { $ORDER_DIRECTION = $_REQUEST["orderdir"]; }


	$query = "
		SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, p.isAvailable, p.experience, p.expertise, p.phone, p.biography, p.avatar, 
			   d.name as department, 
			   l.name as location FROM personnel p 
		LEFT JOIN department d ON (d.id = p.departmentID) 
		LEFT JOIN location l ON (l.id = d.locationID)  
	";

	if ( $WHERE !== "" ) { $query .= "WHERE $WHERE"; }
	if ( $ORDER_BY !== "" ) { $query .= "ORDER BY " . $_REQUEST["orderby"] . " " . $ORDER_DIRECTION; }

	$result = $conn->query($query);
	
	if (!$result) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}
   
   	$data = [];

	while ($row = mysqli_fetch_assoc($result)) {

		array_push($data, $row);

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;
	
	mysqli_close($conn);

	echo json_encode($output); 

?>