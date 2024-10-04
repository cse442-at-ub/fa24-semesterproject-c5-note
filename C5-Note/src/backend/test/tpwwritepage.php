<?php

// TPW Write Page

// Writes into the page with page_id = 1

// Extract info from config.json so that we can access the database
$config = file_get_contents("../../config.json");
$data = json_decode($config);

$username = $data->username;        // Database username
$password = $data->password;        // Database password
$db_name = $data->db_name;          // Database name

// Server name is hardcoded
$server_name = "localhost:3306";    // Server name provided.

// Start a new connection with PHP's mysqli extension
$connection = new mysqli($server_name, $username, $password, $db_name);

// Test the connection
if($connection->connect_error) {
    die("Could not connect to the database");
}


// Since this is connected by POST, there's $_POST["updatetext"] coming from the other php file.
// Sanitize the text
$sanitizedtext = htmlspecialchars($_POST["updatetext"]);

// Update the database
//  > Specifically column 4 of page_id 1 in the database
$sql = mysqli_prepare($connection, "UPDATE notepages SET column4='(?)' WHERE ID='1'");
mysqli_stmt_bind_param($sql, "s", $sanitizedtext);

// Determine if the page was saved
if (mysqli_stmt_execute($sql) === TRUE){
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