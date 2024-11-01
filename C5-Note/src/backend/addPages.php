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
$groupId = $input['group_id'];
$pageContent = $input['page_content'];

try {
    // Get the notebook ID and owner
    $stmt = $connection->prepare("SELECT id, username AS owner FROM notebooks WHERE title = ?");
    $stmt->bind_param("s", $notebookTitle);
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
            echo json_encode(["success" => false, "message" => "User does not have permission to add a page"]);
            exit;
        }
    }

    // Get the current number of pages in the group to determine page_number and page_order
    $stmt = $connection->prepare("SELECT COUNT(*) as total_pages FROM pages WHERE group_id = ?");
    $stmt->bind_param("i", $groupId);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $newPageNumber = $row['total_pages'] + 1;
    $newPageOrder = $row['total_pages']; // Starts at 0 for the first page, then increments

    // Insert the new page with page_order
    $stmt = $connection->prepare("INSERT INTO pages (group_id, page_number, page_content, page_order) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("iisi", $groupId, $newPageNumber, $pageContent, $newPageOrder);
    $stmt->execute();

    echo json_encode(["success" => true, "message" => "Page added successfully", "page_number" => $newPageNumber, "page_order" => $newPageOrder]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to add page",
        "error" => $e->getMessage()
    ]);
}
?>