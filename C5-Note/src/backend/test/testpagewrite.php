<?php

$config = file_get_contents("../../config.json");
$data = json_decode($config);

$username = $data->username;
$password = $data->password;
$db_name = $data->db_name;

// Server name is hardcoded
$server_name = "localhost:3306";

// Start a new mysqli 
$connection = new mysqli($server_name, $username, $password, $db_name);

if($connection->connect_error) {
    die("Could not connect to the database");
}


echo "Testing";


?>