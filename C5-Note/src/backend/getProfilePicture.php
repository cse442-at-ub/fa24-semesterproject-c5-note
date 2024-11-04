<?php

$config = file_get_contents("../config.json");
$data = json_decode($config);

$input = json_decode(file_get_contents("php://input"), true);
$username = $input['username'];

$db_username = $data->username;
$password = $data->password;
$db_name = $data->db_name;


$connection = new mysqli("localhost:3306", $db_username, $password, $db_name);

if($connection->connect_error) {
    http_response_code(500);
    die(json_encode([
        "status" => "failed",
        "message" => "Could not connect to database."
    ]));
}

$statement = $connection->prepare("SELECT * FROM users WHERE username = ?");

$statement->bind_param("s", $username);

$statement->execute();
$result = $statement->get_result();

if($result->num_rows == 1) {
  $id = $result->fetch_assoc()["user_id"];
}
else {
  http_response_code(401);
  die(json_encode([
    "status" => "failed",
    "message" => "User not found."
]));
}

$directory = 'uploads/';
$filenameWithoutExtension = "$id"; // Example filename without extension
$pattern = $directory . $filenameWithoutExtension . '.*';

$files = glob($pattern);
$exactMatches = [];

foreach ($files as $file) {
    if (pathinfo($file, PATHINFO_FILENAME) === $filenameWithoutExtension) {
        $exactMatches[] = $file;
    }
}

if (!empty($exactMatches)) {
    foreach ($exactMatches as $file) {
        $fileName = $file;
    }
} else {
    http_response_code(400);
    die(json_encode([
        "status" => "failed",
        "message" => "Could not find profile picture."
    ]));
}

die(json_encode([
    "status" => "success",
    "message" => $fileName
]));