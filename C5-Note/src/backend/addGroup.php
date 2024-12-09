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

$input = json_decode(file_get_contents("php://input"), true);

$loggedInUsername = $input['username'];
$notebookTitle = $input['title'];
$notebook_id = $input['id'];
$groupName = $input['group_name'];

try {
    // Get the notebook ID and owner
    $stmt = $connection->prepare("SELECT id, username AS owner FROM notebooks WHERE id = ?");
    $stmt->bind_param("i", $notebook_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $notebook = $result->fetch_assoc();
    $notebookId = $notebook['id'];
    $owner = $notebook['owner'];

    if (!$notebookId) {
        echo json_encode(["success" => false, "message" => "Notebook not found"]);
        exit;
    }

    // Check if the logged-in user is either the owner or has access
    if ($loggedInUsername !== $owner) {
        $accessQuery = "SELECT 1 FROM shared_users WHERE notebook_id = ? AND username = ?";
        $accessStmt = $connection->prepare($accessQuery);
        $accessStmt->bind_param("is", $notebookId, $loggedInUsername);
        $accessStmt->execute();
        $accessResult = $accessStmt->get_result();

        if ($accessResult->num_rows === 0) {
            echo json_encode(["success" => false, "message" => "User does not have permission to add a group"]);
            exit;
        }
    }

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

    $groupId = $connection->insert_id;

    echo json_encode([
        "success" => true,
        "group_id" => $groupId
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to add group",
        "error" => $e->getMessage()
    ]);
}
?>
