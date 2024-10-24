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
        // Fetch the highest group_order for this notebook
        $stmt = $connection->prepare("SELECT MAX(group_order) AS max_order FROM notebook_groups WHERE notebook_id = ?");
        $stmt->bind_param("i", $notebookId);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $newGroupOrder = $row['max_order'] !== null ? $row['max_order'] + 1 : 1;

        // Add the new group with the calculated group_order
        $stmt = $connection->prepare("INSERT INTO notebook_groups (notebook_id, group_name, group_order) VALUES (?, ?, ?)");
        $stmt->bind_param("isi", $notebookId, $groupName, $newGroupOrder);
        $stmt->execute();

        $groupId = $connection->insert_id;  // Get the newly inserted group ID

        echo json_encode([
            "success" => true,
            "group_id" => $groupId
        ]);
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
