<?php

$config = file_get_contents("../config.json");
$data = json_decode($config);

$json = json_decode(file_get_contents("php://input"));

$logout_name = $json->username;

$username = $data->username;
$password = $data->password;
$db_name = $data->db_name;

$connection = new mysqli("localhost:3306", $username, $password, $db_name);
$result = $connection->query("SELECT * FROM users WHERE username = '$logout_name'");

if($result->num_rows > 0) {
    $logout_id = $result->fetch_assoc()["user_id"];

    $connection = new mysqli("localhost:3306", $username, $password, $db_name);
    $result = $connection->query("DELETE FROM active_users WHERE user_id = $logout_id");
}
setcookie("username", "", time() - 60);
setcookie("token", "", time() - 60);