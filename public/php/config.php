<?php
	// LOCALHOST SETTINGS
	// $Host = "127.0.0.1";
	// $Port = 3306;
	// $Socket = "";
	// $User = "root";
	// $Password = "";
	// $DBname = "companydirectory"; 

	// CLEARDB REMOTE DATABASE SETTINGS
	$Host = "us-cdbr-east-02.cleardb.com";
	$Port = "3306";
	$Socket = "";
	$User = "b6d2de995b384d";
	$Password = "8f6b5133";
	$DBname = "heroku_ac0f7590a18cbfa";

	// CORS SETTINGS FOR ENABLING API CALLS FROM REACT APP
	header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    header("Access-Control-Allow-Origin: *");
    header('Content-Type: application/json; charset=UTF-8');
	header("Accept: application/json");
    header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");

?>