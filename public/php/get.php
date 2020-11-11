<?php

	$executionStartTime = microtime(true);

	include("config.php");
	
	$conn = new mysqli($Host, $User, $Password, $DBname, $Port, $Socket);
	
	include("queryHandler/unconnected.php");

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
		SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, p.isAvailable, p.experience, p.expertise, p.phone, p.biography, p.avatar, p.posts, p.feedback, p.attendance, p.projects, 
			   d.id as departmentID, 
			   l.id as locationID FROM personnel p 
		LEFT JOIN department d ON (d.id = p.departmentID) 
		LEFT JOIN location l ON (l.id = d.locationID)  
	";

	if ( $WHERE !== "" ) { $query .= "WHERE $WHERE"; }
	if ( $ORDER_BY !== "" ) { $query .= "ORDER BY " . $_REQUEST["orderby"] . " " . $ORDER_DIRECTION; }

	$result = $conn->query($query);
	
	include("queryHandler/failure.php");
   
   	$data = [];
	while ($row = mysqli_fetch_assoc($result)) {
		array_push($data, $row);
	}

	include("queryHandler/success.php");

?>