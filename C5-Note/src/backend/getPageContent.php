<?php

$config = file_get_contents("../config.json");
$data = json_decode($config);
$username = $data->username;
$password = $data->password;
$db_name = $data->db_name;

$connection = new mysqli("localhost:3306", $username, $password, $db_name);


// Test the connection
if($connection->connect_error) {
    die("Could not connect to the database");
}


$loadpageid = $json -> pageid;
$groupid = $json -> groupid;


$sql = $connection->prepare("SELECT * FROM pages WHERE page_number = ? AND group_id = ?");
$sql->bind_param("i","i", $loadpageid,$groupid);

header("Content-Type: application/json; charset=UTF-8");

$sql->execute();
$result = $sql->get_result();
$outp = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($outp);

?>
