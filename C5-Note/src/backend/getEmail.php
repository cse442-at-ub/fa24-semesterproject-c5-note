<?php

$config = file_get_contents("../config.json");
$data = json_decode($config);
$username = $data->username;
$password = $data->password;
$db_name = $data->db_name;

$server_name = "localhost:3306";

$connection = new mysqli($server_name, $username, $password, $db_name);

if ($connection->connect_error) {
    die(json_encode(["error" => "Could not connect to the database: " . $connection->connect_error]));
}

// Check for the "token" cookie
if (!isset($_COOKIE['token'])) {
    die(json_encode(["error" => "Token cookie is not set."]));
}
$token = hash("sha256", $_COOKIE['token']);

// Decode the incoming JSON
$json = json_decode(file_get_contents("php://input"), true);
if (!isset($json['username'])) {
    die(json_encode(["error" => "Username is missing in the request."]));
}
$profile_username = $json['username'];

// Validate token and fetch the user data
$smto = $connection->prepare("
    SELECT u.email, u.username 
    FROM active_users AS a 
    JOIN users AS u ON a.user_id = u.user_id 
    WHERE a.token = ?
");
$smto->bind_param("s", $token);
$smto->execute();
$result = $smto->get_result();

if ($result->num_rows === 0) {
    die(json_encode(["error" => "Invalid token or user not found."]));
}

$current_user = $result->fetch_assoc();
$smto->close();

// Check if the requested profile is the same as the logged-in user
if ($current_user['username'] !== $profile_username) {
    die(json_encode(["error" => "Unauthorized access."]));
}

// Return the email address
echo json_encode(["email" => $current_user['email']]);

// Close the connection
$connection->close();

?>
