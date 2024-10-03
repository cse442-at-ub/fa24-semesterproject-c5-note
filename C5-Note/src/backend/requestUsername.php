<?php

$config = file_get_contents("../config.json");
$data = json_decode($config);
$username = $data->username;
$password = $data->password;
$db_name = $data->db_name;

$json = json_decode(file_get_contents("php://input"));

$request_email = $json->email;

$connection = new mysqli("localhost:3306", $username, $password, $db_name);

$result = $connection->execute_query("SELECT * FROM users WHERE email = ?", $request_email);

if ($result->num_rows == 1) {
    $record = $result->fetch_assoc();
    $request_username = $record["username"];

    mail($request_email,
        "C5 Note Username Reminder",
        "The username associated with this email is " + $request_username ".");
}