<html>
    <head>
        <title>Testing</title>
    </head>
    <body>
        <h1>Notebook Read and Write test</h1>
        <form action="writetest.php" method="POST" id="notebookform">

<!-- Nested PHP to Load Page -->

<?php

$config = file_get_contents("../../config.json");
$data = json_decode($config);

$username = $data->username;        // Database username
$password = $data->password;        // Database password
$db_name = $data->db_name;          // Database name

$server_name = "localhost:3306";    // Server name provided.

$connection = new mysqli($server_name, $username, $password, $db_name);

if($connection->connect_error) {
    die("Could not connect to the database");
}

$sql = mysqli_prepare($connection, "SELECT * FROM notepages WHERE page_id=1");
if (mysqli_stmt_execute($sql) === TRUE){
    echo "Search successful<br>";

    mysqli_stmt_bind_result($sql, $col1, $col2, $col3, $col4);

    mysqli_stmt_fetch($sql);

    // Print those values
    echo "<h3>" . $col3 . "</h3>\n";
    echo '<input type="text" id="textinput" name="textinput" value="' . $col4 . '"><br>';
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
            <input type="submit" value="Save Page">
        </form>

        <script>
                window.onbeforeunload = function(){
                    return 'Are you sure you want to leave?';
                };
        </script>

    </body>
</html>
