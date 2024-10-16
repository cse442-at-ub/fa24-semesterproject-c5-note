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

$sourceid   = $json->sourcepageid;      // Get the page to write to
$pagetitle  = $json->updatetitle;       // What to update the title to
$text       = $json->updatetext;        // What to update the page contents to

// Update the database
//  > Specifically column 4 of page_id 1 in the database
$sql = mysqli_prepare($connection, "UPDATE notepages SET pagename = ?, pagetext = ? WHERE page_id = ?");
$sql->bind_param("ssi", $pagetitle, $text, $sourceid);

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