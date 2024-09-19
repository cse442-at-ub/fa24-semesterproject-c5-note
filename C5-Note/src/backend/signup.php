<?php

/*

We need to set $username, $password, $db_name, but I don't know what those are yet.

*/

$json = json_decode(file_get_contents("php://input"));

$signup_name = $json->username;
$signup_pass = password_hash($json->password, PASSWORD_DEFAULT);
$signup_email = $json->email;

$connection = new mysqli("localhost:3306", $username, $password, $db_name);


if($connection->connect_error) {
       	die("Could not connect to the database");
}


try {
    
    $result = $connection->query("INSERT INTO users (username, password, email) VALUES ('$signup_name', '$signup_pass', '$signup_email')");

    http_response_code(201);
}
catch(Exception $e) {

	http_response_code(409);
}