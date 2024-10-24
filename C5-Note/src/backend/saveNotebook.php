<?php

// TPW Write Page

// Writes into the page with page_id = 1

// Extract info from config.json so that we can access the database
$config = file_get_contents("../config.json");
$data = json_decode($config);
$username = $data->username;
$password = $data->password;
$db_name = $data->db_name;

$json = json_decode(file_get_contents("php://input"));

// Server name is hardcoded
$server_name = "localhost:3306";    // Server name provided.

// Start a new connection with PHP's mysqli extension
$connection = new mysqli($server_name, $username, $password, $db_name);

// Test the connection
if($connection->connect_error) {
    die("Could not connect to the database");
}

require_once './htmlpurifier/htmlpurifier/library/HTMLPurifier.auto.php';
    
$purifier = new HTMLPurifier();

$sourceid   = $json->pageid;      // Get the page to write to
$GroupID  = $json->groupid;       // What to update the title to
$text       = $json->updatetext;        // What to update the page contents to

$clean_html = $purifier->purify($text);

// Update the database
//  > Specifically column 4 of page_id 1 in the database
$sql = mysqli_prepare($connection, "UPDATE pages SET page_content = ? WHERE page_number = ? AND group_id = ?");
$sql->bind_param("sii", $clean_html, $sourceid,$GroupID);

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