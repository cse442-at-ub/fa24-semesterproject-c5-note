<?php

    // TPW Load Page JSON

    // Loads the contents of page with page_id = 1, and returns as a JSON file

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


    $loadpageid = $json -> sourcepageid;


    $sql = $connection->prepare("SELECT * FROM notepages WHERE page_id = ?");
    $sql->bind_param("i", $loadpageid);
    
    header("Content-Type: application/json; charset=UTF-8");

    $sql->execute();
    $result = $sql->get_result();
    $outp = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode($outp);

?>
