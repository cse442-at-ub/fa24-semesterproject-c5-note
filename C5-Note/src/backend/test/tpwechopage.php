<?php

// TPW Echo Page

// Echoes the contents of the the page with page_id = 1



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


// Fetch the page with page_id=1 from the database
$sql = mysqli_prepare($connection, "SELECT * FROM notepages WHERE page_id=1");
if (mysqli_stmt_execute($sql) === TRUE){
    echo "Search successful<br>";

    // Bind the columns in the result set to variables
    mysqli_stmt_bind_result($sql, $col1, $col2, $col3, $col4);

    // Actually get the values copied into those variables
    // page_id is unique, so can only ever fetch once
    mysqli_stmt_fetch($sql);

    // Print those values
    echo "Name:    $col3<br>\n";
    echo "Content: $col4<br>\n";
}
// Error checking
else {
    echo "Connection error\n";
}

// Close everything
$sql->close();
$connection->close();


// End of PHP
?>
