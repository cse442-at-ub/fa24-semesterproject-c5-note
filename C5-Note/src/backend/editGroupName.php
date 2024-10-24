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

// Read input
$input = json_decode(file_get_contents("php://input"), true);

$group_id = $input['group_id'];  // The ID of the group to edit
$new_group_name = $input['new_group_name'];  // The new group name

try {
    // Update the group name in the database using group_id
    $stmt = $connection->prepare("UPDATE notebook_groups SET group_name = ? WHERE id = ?");
    $stmt->bind_param("si", $new_group_name, $group_id);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to update group name"]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Server error: " . $e->getMessage()
    ]);
}
