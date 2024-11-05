<?php

header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

$config = file_get_contents("../config.json");
$data = json_decode($config);
$username = $data->username;
$password = $data->password;
$db_name = $data->db_name;

$connection = new mysqli("localhost", $username, $password, $db_name, 3306); // Fixed host and port

// Test the connection
if ($connection->connect_error) {
    die(json_encode(["error" => "Could not connect to the database: " . $connection->connect_error]));
}

// Check for the "token" cookie
if (isset($_COOKIE['token'])) {
    $token = hash("sha256", $_COOKIE['token']);
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

$current_username = $username_result->fetch_assoc()['username'];
$smto->close();

require_once './htmlpurifier/htmlpurifier/library/HTMLPurifier.auto.php';
$purifier = new HTMLPurifier();

$json = json_decode(file_get_contents('php://input')); // Ensure you read input correctly
$loadpageid = $json->pageid;
$groupid = $json->groupid;
$isInitialFetch = $json->isInitialFetch ?? false; // Default to false if not set

header("Content-Type: application/json; charset=UTF-8");

// Prepare the SQL statement to get the page content and last user
$sql = $connection->prepare("SELECT page_content, last_user, last_mod FROM pages WHERE page_number = ? AND group_id = ?");
$sql->bind_param("ii", $loadpageid, $groupid); // Fixed parameter binding
$sql->execute();
$result = $sql->get_result();

if ($result->num_rows > 0) {
    $outp = $result->fetch_assoc(); // Fetch the result correctly
    $lastUser = $outp['last_user'];
    $lastmod = $outp['last_mod'];
    $clean_html = $purifier->purify($outp['page_content']);
    
    // Always return content if it's available
    echo json_encode([
        "content" => $clean_html,
        'last_user' => $lastUser,
        'last_mod' => $lastmod
    ]);
    exit;
} else {
    // No content found
    echo json_encode(["error" => "No content found for this page."]);
}

$sql->close(); // Close the statement
$connection->close(); // Close the connection
?>
