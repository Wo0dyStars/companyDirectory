<?php

	$executionStartTime = microtime(true);

    include("../config.php");
	
	$conn = new mysqli($Host, $User, $Password, $DBname, $Port, $Socket);
	
	include("../queryHandler/unconnected.php");

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $_POST = json_decode(file_get_contents("php://input"), true);
        $trimmedName = trim( $_POST["name"] );
        $trimmedID = trim( $_POST["locationID"] );

		if ( !empty( $trimmedName && !empty( $trimmedID )) ) {
            $query = "UPDATE department
                      SET name = ?, locationID = ?
                      WHERE id = ?";
        
            $result = $conn->prepare($query);
            $result->bind_param('sii', $trimmedName, $trimmedID, $_POST["id"]);
            $result->execute();
            
            include("../queryHandler/failure.php");
        
            $data = [];
        
            include("../queryHandler/success.php");
        }
    }

?>