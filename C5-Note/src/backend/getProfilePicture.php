<?php

$config = file_get_contents("../config.json");
$data = json_decode($config);

$username = $data->username;
$password = $data->password;
$db_name = $data->db_name;

if (isset($_COOKIE["token"])) {
  $token = $_COOKIE["token"];
}
else {
  http_response_code(400);
  die(json_encode([
    "status" => "failed",
    "message" => "No token present."
]));
}

$connection = new mysqli("localhost:3306", $username, $password, $db_name);

if($connection->connect_error) {
    http_response_code(500);
    die(json_encode([
        "status" => "failed",
        "message" => "Could not connect to database."
    ]));
}

$statement = $connection->prepare("SELECT * FROM active_users WHERE token = ?");

$statement->bind_param("s", hash("sha256", $token));

$statement->execute();
$result = $statement->get_result();

if($result->num_rows == 1) {
  $id = $result->fetch_assoc()["user_id"];
}
else {
  http_response_code(401);
  die(json_encode([
    "status" => "failed",
    "message" => "Invalid token"
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
    die(json_encode([
        "status" => "failed",
        "message" => "Could not find profile picture."
    ]));
}

die(json_encode([
    "status" => "success",
    "message" => $fileName
]));