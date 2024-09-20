<?php

$config = file_get_contents("../config.json");
$data = json_decode($config);

$username = $data->username;
$password = $data->password;
$db_name = $data->db_name;

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
    die(json_encode([
        "status" => "201",
        "message" => "done"
    ]));
}
catch(Exception $e) {

	http_response_code(409);
}