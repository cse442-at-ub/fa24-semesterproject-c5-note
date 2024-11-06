<?php

$config = file_get_contents("../config.json");
$data = json_decode($config);

$db_username = $data->username;
$password = $data->password;
$db_name = $data->db_name;

$input = json_decode(file_get_contents("php://input"), true);
$username = $input['username'];

$connection = new mysqli("localhost:3306", $db_username, $password, $db_name);

$stmt = $connection->prepare("SELECT * FROM notebooks WHERE username = ? AND isPrivate = 1");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

$rows = array();
while($row = $result->fetch_assoc()) {
    array_push($rows, $row);
}

http_response_code(200);
die(json_encode($rows));