<?php

// TPW Write Page

// Writes into the page with page_id = 1

// Extract info from config.json so that we can access the database
$config = file_get_contents("../../config.json");
$data = json_decode($config);

$username = $data->username;        // Database username
$password = $data->password;        // Database password
$db_name = $data->db_name;          // Database name

$json = json_decode(file_get_contents("php://input"));

// Server name is hardcoded
$server_name = "localhost:3306";    // Server name provided.

// Start a new connection with PHP's mysqli extension
$connection = new mysqli($server_name, $username, $password, $db_name);

// Test the connection
if($connection->connect_error) {
    die("Could not connect to the database");
}

$pagetitle = $json->updatetitle;
$text = $json->updatetext;

// Update the database
//  > Specifically column 4 of page_id 1 in the database
$sql = mysqli_prepare($connection, "UPDATE notepages SET pagetext = ? WHERE page_id = 1");
$sql->bind_param("s", $text);

// Determine if the page was saved
if ($sql->execute()){
    echo 'Page saved successfully.<br>\n';
}
else {
    echo 'Error saving the page.<br>\n';
}


// Close everything
$sql->close();
$connection->close();

// End of PHP
?>