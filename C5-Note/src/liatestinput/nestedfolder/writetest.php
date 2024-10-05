<?php

// Same connection code as before

$config = file_get_contents("../../config.json");
$data = json_decode($config);

$username = $data->username;        // Database username
$password = $data->password;        // Database password
$db_name = $data->db_name;          // Database name

$server_name = "localhost:3306";    // Server name provided.



// Start a new connection
$connection = new mysqli($server_name, $username, $password, $db_name);

if($connection->connect_error) {
    die("Could not connect to the database");
}

// Run a SQL query via mysqli
$sql = mysqli_prepare($connection, "UPDATE notepages SET pagetext = (?) WHERE page_id=1");
mysqli_stmt_bind_param($sql, "s", $_POST["textinput"]);


// If the query was successful, refresh the page to see the result.
if (mysqli_stmt_execute($sql) === TRUE){

    // Redirect to the original page.
    header('Location: testwritefunction.php');
}

else {

    echo "Connection error\n";
}

$sql->close();
$connection->close();

?>
