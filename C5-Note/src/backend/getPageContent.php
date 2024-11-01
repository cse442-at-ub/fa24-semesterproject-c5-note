<?php

$config = file_get_contents("../config.json");
$data = json_decode($config);
$username = $data->username;
$password = $data->password;
$db_name = $data->db_name;

$connection = new mysqli("localhost", $username, $password, $db_name, 3306); // Fixed host and port

// Test the connection
if ($connection->connect_error) {
    die("Could not connect to the database: " . $connection->connect_error);
}

require_once './htmlpurifier/htmlpurifier/library/HTMLPurifier.auto.php';
    
$purifier = new HTMLPurifier();

$json = json_decode(file_get_contents('php://input')); // Ensure you read input correctly
$loadpageid = $json->pageid;
$groupid = $json->groupid;

// Prepare the SQL statement
$sql = $connection->prepare("SELECT page_content,last_user FROM pages WHERE page_number = ? AND group_id = ?");
$sql->bind_param("ii", $loadpageid, $groupid); // Fixed parameter binding

header("Content-Type: application/json; charset=UTF-8");

$sql->execute();
$result = $sql->get_result();
$outp = $result->fetch_assoc(); // Fetch the result correctly

$clean_html = $purifier->purify($outp['page_content']);

echo json_encode(["content" => $clean_html,
'last_user' => $outp['last_user']
]); // Fixed JSON encoding

$sql->close(); // Close the statement
$connection->close(); // Close the connection
?>
