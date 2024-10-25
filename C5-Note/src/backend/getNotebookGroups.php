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

try {
    // Get the notebook ID, first check if the user is the owner
    $stmt = $connection->prepare("SELECT id, username FROM notebooks WHERE title = ?");
    $stmt->bind_param("s", $notebookTitle);
    $stmt->execute();
    $result = $stmt->get_result();
    $notebook = $result->fetch_assoc();

    if (!$notebook) {
        echo json_encode([
            "success" => false,
            "message" => "Notebook not found"
        ]);
        exit;
    }

    $notebookId = $notebook['id'];
    $notebookOwner = $notebook['username'];

    // Check if the logged-in user is the owner or a shared user
    if ($notebookOwner !== $loggedInUsername) {
        // Check if the user has access in shared_users
        $stmtShared = $connection->prepare("SELECT COUNT(*) as count FROM shared_users WHERE notebook_id = ? AND username = ?");
        $stmtShared->bind_param("is", $notebookId, $loggedInUsername);
        $stmtShared->execute();
        $sharedResult = $stmtShared->get_result();
        $sharedCount = $sharedResult->fetch_assoc()['count'];

        if ($sharedCount == 0) {
            // User doesn't have access to this notebook
            echo json_encode([
                "success" => false,
                "message" => "You do not have access to this notebook."
            ]);
            exit;
        }
    }

    // Fetch the groups for the notebook ordered by group_order
    $stmtGroups = $connection->prepare("SELECT id, group_name, group_order FROM notebook_groups WHERE notebook_id = ? ORDER BY group_order ASC");
    $stmtGroups->bind_param("i", $notebookId);
    $stmtGroups->execute();
    $resultGroups = $stmtGroups->get_result();

    $groups = [];
    while ($group = $resultGroups->fetch_assoc()) {
        $groupId = $group['id'];

        // Fetch the pages for each group
        $stmtPages = $connection->prepare("SELECT page_number, page_content FROM pages WHERE group_id = ?");
        $stmtPages->bind_param("i", $groupId);
        $stmtPages->execute();
        $resultPages = $stmtPages->get_result();

        $pages = [];
        while ($page = $resultPages->fetch_assoc()) {
            $pages[] = $page;
        }

        // Include the group_id, group_name, and group_order in the response
        $groups[] = [
            'group_id' => $group['id'],
            'group_name' => $group['group_name'],
            'group_order' => $group['group_order'],
            'pages' => $pages
        ];
    }

    echo json_encode([
        "success" => true,
        "notebook_id" => $notebookId, // Add notebook ID to the response
        "isOwner" => $notebookOwner === $loggedInUsername, // Indicate if the user is the owner
        "groups" => $groups
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}

$connection->close();
?>
