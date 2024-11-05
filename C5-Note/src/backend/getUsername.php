<?php

// TPW Write Page

// Extract info from config.json for database access
$config = file_get_contents("../config.json");
$data = json_decode($config);
$username = $data->username;
$password = $data->password;
$db_name = $data->db_name;

$json = json_decode(file_get_contents("php://input"));

// Server name is hardcoded
$server_name = "localhost:3306"; // Server name provided.

// Start a new connection with PHP's mysqli extension
$connection = new mysqli($server_name, $username, $password, $db_name);

// Test the connection
if ($connection->connect_error) {
    die(json_encode(["error" => "Could not connect to the database: " . $connection->connect_error]));
}

// Check for the "token" cookie
if (isset($_COOKIE['token'])) {
    $token = hash("sha256",$_COOKIE['token']);
} else {
    die(json_encode(["error" => "Token cookie is not set.", "token" => null])); // Added null value for token
}

// Prepare statement to get user_id based on the token
$smto = $connection->prepare("SELECT user_id FROM active_users WHERE token = ?");
$smto->bind_param("s", $token);
$smto->execute();
$resulto = $smto->get_result();

if ($resulto->num_rows === 0) {
    die(json_encode(["error" => "Invalid token.", "token" => $token])); // Added token to error response
}

$user = $resulto->fetch_assoc();
$user_id = $user['user_id'];
$smto->close();

// Prepare statement to get username based on user_id
$smto = $connection->prepare("SELECT username FROM users WHERE user_id = ?");
$smto->bind_param("i", $user_id);
$smto->execute();
$username_result = $smto->get_result();

if ($username_result->num_rows === 0) {
    die(json_encode(["error" => "User not found."]));
}

$username_found = $username_result->fetch_assoc()['username'];
$smto->close();

// Include HTML Purifier
require_once './htmlpurifier/htmlpurifier/library/HTMLPurifier.auto.php';
$purifier = new HTMLPurifier();

// Purify the username
$clean_html = $purifier->purify($username_found);

// Return the sanitized username as JSON
echo json_encode(["username" => $clean_html]);

// Close the database connection
$connection->close();

?>
