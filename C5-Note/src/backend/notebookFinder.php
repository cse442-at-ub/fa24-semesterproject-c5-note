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
if (isset($_COOKIE['token'])) {
    $token = hash("sha256",$_COOKIE['token']);
} else {
    die(json_encode(["error" => "Token cookie is not set.", "token" => null])); // Added null value for token
}

// Prepare statement to get user_id based on the token
$smto = $connection->prepare("SELECT user_id FROM active_users WHERE token = ?");
$smto->bind_param("s", $token);
$smto->execute();
$resulto = $smto->get_result();

if ($resulto->num_rows === 0) {
    die(json_encode(["error" => "Invalid token."]));
}

$user = $resulto->fetch_assoc();
$user_id = $user['user_id'];
$smto->close();

// Prepare statement to get username based on user_id
$smto = $connection->prepare("SELECT username FROM users WHERE user_id = ?");
$smto->bind_param("i", $user_id);
$smto->execute();
$username_result = $smto->get_result();

if ($username_result->num_rows === 0) {
    die(json_encode(["error" => "User not found."]));
}

$username_found = $username_result->fetch_assoc()['username'];
$smto->close();


$loggedInUsername = $username_found;

try {
    $st = $connection->prepare("SELECT sort FROM users WHERE username = ?");
    $st->bind_param("s", $loggedInUsername);
    $st->execute();
    $st->bind_result($sort_type);
    $st->fetch();
    $st->close(); // Close the statement

    //query to get notebooks for the specific logged in user
    $stmt = $connection->prepare("SELECT title, description, color, time_created, last_modified FROM notebooks WHERE username = ?");
    $stmt->bind_param("s", $loggedInUsername); //protecting from possible SQL injection
    $stmt->execute(); //query sent to db
    
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $notebooks = [];

        while($row = $result->fetch_assoc()) {
            
            $timeCreated = new DateTime($row['time_created']);
            $lastModified = new DateTime($row['last_modified']);

            $notebookId = $row['id']; // Initialize notebookId

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
            $notebooks[] = [
                'groups' => $row['groups'],
                'title' => $row['title'],
                'description' => $row['description'],
                'color' => $row['color'],
                'time_created' => $timeCreated->format('Y-m-d H:i:s'), // Format as needed
                'last_modified' => $lastModified->format('Y-m-d H:i:s') // Format as needed
            ];
        }

        // Sorting based on the provided sort_type
        switch ($sort_type) {
            case 0: // Newest Edited
                usort($notebooks, function($a, $b) {
                    return strtotime($b['last_modified']) - strtotime($a['last_modified']);
                });
                break;
            case 1: // Oldest Edited
                usort($notebooks, function($a, $b) {
                    return strtotime($a['last_modified']) - strtotime($b['last_modified']);
                });
                break;
            case 2: // Newest Created
                usort($notebooks, function($a, $b) {
                    return strtotime($b['time_created']) - strtotime($a['time_created']);
                });
                break;
            case 3: // Oldest Created
                usort($notebooks, function($a, $b) {
                    return strtotime($a['time_created']) - strtotime($b['time_created']);
                });
                break;
            case 4: // Alphabetical A-Z
                usort($notebooks, function($a, $b) {
                    return strcmp($a['title'], $b['title']);
                });
                break;
            case 5: // Alphabetical Z-A
                usort($notebooks, function($a, $b) {
                    return strcmp($b['title'], $a['title']);
                });
                break;
        }

        /* SAMPLE RESPONSE JSON; example below has 3 rows
        [
            {
                "title": "Chemistry",
                "description": "Chemistry notes for class",
                "color": "#cccccc"
            },
            {
                "title": "Geography",
                "description": "Geography notes on Europe",
                "color": "#cccccc"
            },
            {
                "title": "CSE 442",
                "description": "Notes on CSE 442 programming",
                "color": "#cccccc"
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
