<?php

	$executionStartTime = microtime(true);

    include("../config.php");
	
	$conn = new mysqli($Host, $User, $Password, $DBname, $Port, $Socket);
	
	include("../queryHandler/unconnected.php");

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $_POST = json_decode(file_get_contents("php://input"), true);
        $trimmedName = trim( $_POST["name"] );

		if ( !empty( $trimmedName ) ) {
            $query = "UPDATE location
                      SET name = ?
                      WHERE id = ?";
        
            $result = $conn->prepare($query);
            $result->bind_param('si', $trimmedName, $_POST['id']);
            $result->execute();
            
            include("../queryHandler/failure.php");
        
            $data = [];
        
            include("../queryHandler/success.php");
        }
    }

?>