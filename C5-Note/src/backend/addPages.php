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
$groupId = $input['group_id'];
$pageContent = $input['page_content'];

try {
    // First, check if the notebook exists
    $stmt = $connection->prepare("SELECT id FROM notebooks WHERE username = ? AND title = ?");
    $stmt->bind_param("ss", $loggedInUsername, $notebookTitle);
    $stmt->execute();
    $result = $stmt->get_result();
    $notebook = $result->fetch_assoc();
    $notebookId = $notebook['id'];

    if ($notebookId) {
        // Get the current number of pages in the group
        $stmt = $connection->prepare("SELECT COUNT(*) as total_pages FROM pages WHERE group_id = ?");
        $stmt->bind_param("i", $groupId);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $totalPages = $row['total_pages'];

        // The new page number will be the current total number of pages + 1
        $newPageNumber = $totalPages + 1;

        // Insert the new page into the pages table
        $stmt = $connection->prepare("INSERT INTO pages (group_id, page_number, page_content) VALUES (?, ?, ?)");
        $stmt->bind_param("iis", $groupId, $newPageNumber, $pageContent);
        $stmt->execute();

        echo json_encode(["success" => true, "message" => "Page added successfully", "page_number" => $newPageNumber]);
    } else {
        echo json_encode(["success" => false, "message" => "Notebook not found"]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to add page",
        "error" => $e->getMessage()
    ]);
}
?>