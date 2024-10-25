<?php

// TPW Write Page

// Extract info from config.json so that we can access the database
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
    die("Could not connect to the database: " . $connection->connect_error);
}

require_once './htmlpurifier/htmlpurifier/library/HTMLPurifier.auto.php';

$purifier = new HTMLPurifier();

$sourceid = $json->pageid;      // Get the page to write to
$GroupID = $json->groupid;      // Group ID for notebook
$text = $json->updatetext;      // What to update the page contents to

$clean_html = $purifier->purify($text);

// Get the notebook ID from the group ID
$smt = $connection->prepare("SELECT notebook_id FROM notebook_groups WHERE id = ?");
$smt->bind_param("i", $GroupID);
$smt->execute();
$result = $smt->get_result();
$notebook_id = $result->fetch_assoc()['notebook_id']; // Fetch the notebook ID
$smt->close();

// Get the current datetime in the desired format
$currentDateTime = date('Y-m-d H:i:s'); // Format: 'YYYY-MM-DD HH:MM:SS'

// Prepare the SQL statement to update the last modified date
$smt2 = $connection->prepare("UPDATE notebooks SET last_modified = ? WHERE id = ?");
$smt2->bind_param("si", $currentDateTime, $notebook_id); // Use notebook_id here

// Execute the statement
$smt2->execute();
$smt2->close();

// Update the database for page content
$sql = $connection->prepare("UPDATE pages SET page_content = ? WHERE page_number = ? AND group_id = ?");
$sql->bind_param("sii", $clean_html, $sourceid, $GroupID);

// Determine if the page was saved
if ($sql->execute()) {
    echo 'Page saved successfully.<br>\n';
} else {
    echo 'Error saving the page: ' . $sql->error . '<br>\n'; // Show specific error
}

// Close everything
$sql->close();
$connection->close();

// End of PHP
?>
