<?php

$config = file_get_contents("../config.json");
$data = json_decode($config);

$username = $data->username;
$password = $data->password;
$db_name = $data->db_name;

$json = json_decode(file_get_contents("php://input"));

$login_username = $json->username;
$login_password = $json->password;

$connection = new mysqli("localhost:3306", $username, $password, $db_name);


if($connection->connect_error) {
    die("Could not connect to the database");
}

try {
    $result = $connection->query("SELECT * FROM users WHERE username = '$login_username'");

    if ($result->num_rows == 1) {
    $record = $result->fetch_assoc();
    $hashed_password = $record["password"];
    $user_id = $record["user_id"];
    $token = random_bytes(32);
    $hashed_token = hash("sha256", $token);

    $connection = new mysqli("localhost:3306", $username, $password, $db_name);

    if($connection->connect_error) {
            die("Could not connect to the database");
    }

    if(password_verify($login_password, $hashed_password)) {

        $result = $connection->query("INSERT INTO active_users (user_id, token) VALUES ($user_id, '$hashed_token')");

        http_response_code(201);
        setcookie("username", '$login_username', time() + 60);
        setcookie("token", "$token", time() + 60);
    }
    else {

        http_response_code(401);
        die(json_encode([
            "status" => "failed",
            "message" => "Incorrect credentials"
        ]));

    }
    }
    else {
    
    http_response_code(401);
    die(json_encode([
        "status" => "failed",
        "message" => "Incorrect credentials"
    ]));
    }
    }
catch (Exception $e) {

    http_response_code(401);
    die(json_encode([
    "status" => "failed",
    "message" => "Database Error"
    ]));
}