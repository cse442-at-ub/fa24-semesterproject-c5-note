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
    // Get the notebook ID for the username and title
    $stmt = $connection->prepare("SELECT id FROM notebooks WHERE username = ? AND title = ?");
    $stmt->bind_param("ss", $loggedInUsername, $notebookTitle);
    $stmt->execute();
    $result = $stmt->get_result();
    $notebook = $result->fetch_assoc();
    $notebookId = $notebook['id'];

    if ($notebookId) {
        // Fetch the groups for the notebook from notebook_groups table, include group_id
        $stmt = $connection->prepare("SELECT id, group_name FROM notebook_groups WHERE notebook_id = ?");
        $stmt->bind_param("i", $notebookId);
        $stmt->execute();
        $result = $stmt->get_result();

        $groups = [];
        while ($group = $result->fetch_assoc()) {
            $groupId = $group['id'];

            // Fetch the pages for each group from the pages table
            $stmtPages = $connection->prepare("SELECT page_number, page_content FROM pages WHERE group_id = ?");
            $stmtPages->bind_param("i", $groupId);
            $stmtPages->execute();
            $resultPages = $stmtPages->get_result();

            $pages = [];
            while ($page = $resultPages->fetch_assoc()) {
                $pages[] = $page;
            }

            // Include the group_id in the response
            $groups[] = [
                'group_id' => $group['id'],  // Added group_id
                'group_name' => $group['group_name'],
                'pages' => $pages
            ];
        }

        echo json_encode([
            "success" => true,
            "groups" => $groups
        ]);

        /* EXAMPLE
        {
            "success": true,
            "groups": [
                {
                    "group_id": 1,  // The unique ID of the group
                    "group_name": "Chapter 1",
                    "pages": [
                        {
                            "page_number": 1,
                            "page_content": "Introduction to Chapter 1"
                        },
                        {
                            "page_number": 2,
                            "page_content": "More details on Chapter 1"
                        }
                    ]
                },
                {
                    "group_id": 2,  // The unique ID of the group
                    "group_name": "Chapter 2",
                    "pages": [
                        {
                            "page_number": 1,
                            "page_content": "Introduction to Chapter 2"
                        }
                    ]
                }
            ]
        }
        */

    } else {
        echo json_encode([
            "success" => false,
            "message" => "Notebook not found"
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}
?>
