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

//read input
$input = json_decode(file_get_contents("php://input"), true);

$loggedInUsername = $input['username'];
$notebookTitle = $input['title'];
$groupName = $input['group_name'];

try {
    // Get the notebook ID
    $stmt = $connection->prepare("SELECT id FROM notebooks WHERE username = ? AND title = ?");
    $stmt->bind_param("ss", $loggedInUsername, $notebookTitle);
    $stmt->execute();
    $result = $stmt->get_result();
    $notebook = $result->fetch_assoc();
    $notebookId = $notebook['id'];

    if ($notebookId) {
        // Add the new group to the notebook (updated table name)
        $stmt = $connection->prepare("INSERT INTO notebook_groups (notebook_id, group_name) VALUES (?, ?)");
        $stmt->bind_param("is", $notebookId, $groupName);
        $stmt->execute();

        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Notebook not found"]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to add group"
    ]);
}
?>
