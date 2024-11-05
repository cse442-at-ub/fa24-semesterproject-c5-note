<?php

$config = file_get_contents("../config.json");
$data = json_decode($config);

$db_username = $data->username;
$password = $data->password;
$db_name = $data->db_name;

$input = json_decode(file_get_contents("php://input"), true);
$search = $input['search'];

if (ctype_space($search) || $search == '') {
    http_response_code(400);
    die(json_encode([
        "status" => "failure",
        "message" => "Search was only whitespace."
    ]));
}

$search = "%" . $search . "%";

$connection = new mysqli("localhost:3306", $db_username, $password, $db_name);

$stmt = $connection->prepare("SELECT username FROM users WHERE UPPER(username) LIKE UPPER(?) ");
$stmt->bind_param("s", $search);
$stmt->execute();
$result = $stmt->get_result();

$rows = array();
while($row = $result->fetch_assoc()) {
    array_push($rows, $row["username"]);
}

http_response_code(200);
die(json_encode([
    "status" => "success",
    "names" => json_encode($rows)
]));