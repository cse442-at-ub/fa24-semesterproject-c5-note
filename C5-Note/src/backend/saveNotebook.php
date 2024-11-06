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
    die(json_encode(["error" => "Invalid token."]));
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

// Get parameters from the JSON request
if (!isset($json->pageid, $json->groupid, $json->updatetext)) {
    die(json_encode(["error" => "Missing required parameters."]));
}

$sourceid = $json->pageid;      // Page to write to
$GroupID = $json->groupid;      // Group ID for notebook
$text = $json->updatetext;      // Content to update the page with

// Purify the input text
$clean_html = $purifier->purify($text);

// Get the notebook ID from the group ID
$smt = $connection->prepare("SELECT notebook_id FROM notebook_groups WHERE id = ?");
$smt->bind_param("i", $GroupID);
$smt->execute();
$result = $smt->get_result();

if ($result->num_rows === 0) {
    die(json_encode(["error" => "Notebook not found."]));
}

$notebook_id = $result->fetch_assoc()['notebook_id'];
$smt->close();

// Get the current datetime in the desired format
$currentDateTime = date('Y-m-d H:i:s'); // Format: 'YYYY-MM-DD HH:MM:SS'

// Update the last modified date
$smt2 = $connection->prepare("UPDATE notebooks SET last_modified = ? WHERE id = ?");
$smt2->bind_param("si", $currentDateTime, $notebook_id);
$smt2->execute();
$smt2->close();

// Update the database for page content
$sql = $connection->prepare("UPDATE pages SET page_content = ?, last_user = ?, last_mod = ? WHERE page_number = ? AND group_id = ?");
$sql->bind_param("sssii", $clean_html, $username_found,$currentDateTime, $sourceid, $GroupID);

// Determine if the page was saved
if ($sql->execute()) {
    echo json_encode(["message" => "Page saved successfully."]);
} else {
    echo json_encode(["error" => "Error saving the page: " . $sql->error]);
}

// Close everything
$sql->close();
$connection->close();

?>
