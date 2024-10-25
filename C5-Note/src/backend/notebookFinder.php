<?php

$config = file_get_contents("../config.json");
$data = json_decode($config);

$username = $data->username;
$password = $data->password;
$db_name = $data->db_name;

$connection = new mysqli("localhost:3306", $username, $password, $db_name);

if($connection->connect_error) {
    die("Could not connect to the database");
}

// Reading input data
$input = json_decode(file_get_contents("php://input"), true);
$loggedInUsername = $input['username'];

try {
    // Query to get notebooks for the specific logged in user
    $stmt = $connection->prepare("SELECT id, title, description, color FROM notebooks WHERE username = ?");
    $stmt->bind_param("s", $loggedInUsername); // Inputs loggedInUser for ?
    $stmt->execute();

    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $notebooks = [];

        while($row = $result->fetch_assoc()) {
            $notebookId = $row['id'];

            // Fetch groups and pages for each notebook
            $stmtGroups = $connection->prepare("SELECT id as group_id, group_name FROM notebook_groups WHERE notebook_id = ? ORDER BY group_order ASC");
            $stmtGroups->bind_param("i", $notebookId);
            $stmtGroups->execute();
            $resultGroups = $stmtGroups->get_result();
            
            $groups = [];
            while($group = $resultGroups->fetch_assoc()) {
                $groupId = $group['group_id'];

                // Fetch pages for each group
                $stmtPages = $connection->prepare("SELECT page_number, page_content FROM pages WHERE group_id = ? ORDER BY page_number ASC LIMIT 1");
                $stmtPages->bind_param("i", $groupId);
                $stmtPages->execute();
                $resultPages = $stmtPages->get_result();

                if ($resultPages->num_rows > 0) {
                    $page = $resultPages->fetch_assoc();
                    $group['first_page'] = $page;
                }

                $groups[] = $group;
            }

            $row['groups'] = $groups;
            $notebooks[] = $row;
        }

        /* EXAMPLE JSON RESPONSE
        [
            {
                "id": 1,
                "title": "Chemistry",
                "description": "Chemistry notes for class",
                "color": "#cccccc",
                "groups": [
                    {
                        "group_id": 101,
                        "group_name": "Chapter 1",
                        "first_page": null
                    },
                    {
                        "group_id": 102,
                        "group_name": "Chapter 2",
                        "first_page": {
                            "page_number": 1,
                            "page_content": "Introduction to Molecular Structures"
                        }
                    }
                ]
            },
            {
                "id": 2,
                "title": "Geography",
                "description": "Geography notes on Europe",
                "color": "#cccccc",
                "groups": [
                    {
                        "group_id": 201,
                        "group_name": "Chapter 1",
                        "first_page": null
                    }
                ]
            }
        ]

        */

        echo json_encode($notebooks);

    } else {
        echo json_encode([]);
    }

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "500",
        "message" => "Database query failed"
    ]);
}

$connection->close();

?>
