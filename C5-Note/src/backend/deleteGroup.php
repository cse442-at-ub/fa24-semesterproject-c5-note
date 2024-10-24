<?php

$config = file_get_contents("../config.json");
$data = json_decode($config);

$username = $data->username;
$password = $data->password;
$db_name = $data->db_name;

$connection = new mysqli("localhost:3306", $username, $password, $db_name);

if ($connection->connect_error) {
    die("Could not connect to the database");
}

// Read input from frontend
$input = json_decode(file_get_contents("php://input"), true);
$groupId = $input['group_id'];

try {
    // First, delete pages associated with the group
    $stmtPages = $connection->prepare("DELETE FROM pages WHERE group_id = ?");
    $stmtPages->bind_param("i", $groupId);
    $stmtPages->execute();
    
    // Then, delete the group itself
    $stmtGroup = $connection->prepare("DELETE FROM notebook_groups WHERE id = ?");
    $stmtGroup->bind_param("i", $groupId);
    $stmtGroup->execute();

    echo json_encode(["success" => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error deleting group: " . $e->getMessage()
    ]);
}

$connection->close();

?>