<?php

// Delete Notebook (Destructive)
// > Lia (10/30/24)
// Removes a notebook from a database, after deleting its groups, after deleting its pages.

// Extract info from config.json so that we can access the database
$config = file_get_contents("../../config.json");
$data = json_decode($config);

$username = $data->username;        // Database username
$password = $data->password;        // Database password
$db_name = $data->db_name;          // Database name

// Decode the json object passed into the php server
$json = json_decode(file_get_contents("php://input"));

// Server name is hardcoded
$server_name = "localhost:3306";    // Server name provided.

// Start a new connection with PHP's mysqli extension
$connection = new mysqli($server_name, $username, $password, $db_name);

// Test the connection
if($connection->connect_error) {
    die("Could not connect to the database");
}

$targetid   = $json->notebookid;      // Get the page to write to

// Update the database
//  > Delete all pages associated with notebook
$sql = mysqli_prepare($connection, "DELETE FROM pages WHERE group_id IN (SELECT id FROM notebook_groups WHERE notebook_id = ?)");
$sql->bind_param("i", $targetid);

// Determine if the notebook was deleted
if ($sql->execute()){
    echo 'Notebook deleted successfully.<br>\n';
}
else {
    echo 'Error deleting notebook.<br>\n';
}

// Update the database
////////////////////////////////////////////////
// 1.)Delete all pages associated with notebook
////////////////////////////////////////////////
$sql = mysqli_prepare($connection, "DELETE FROM pages WHERE group_id IN (SELECT id FROM notebook_groups WHERE notebook_id = ?)");
$sql->bind_param("i", $targetid);

// Determine if the pages were deleted
if ($sql->execute()){echo 'Pages deleted successfully.<br>\n';}
else {echo 'Error deleting pages.<br>\n';}


////////////////////////////////////////////////
// 2.)Delete all groups associated with notebook
////////////////////////////////////////////////
$sql = mysqli_prepare($connection, "");
$sql->bind_param("i", $targetid);

// Determine if the groups was deleted
if ($sql->execute()){echo 'Groups deleted successfully.<br>\n';}
else {echo 'Error deleting groups.<br>\n';}

////////////////////////////////////////////////
// 3.)Delete the notebook
////////////////////////////////////////////////

// Close everything
$sql->close();
$connection->close();

// End of PHP
?>