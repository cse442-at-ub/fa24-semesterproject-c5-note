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

//reading input data
$input = json_decode(file_get_contents("php://input"), true);
$loggedInUsername = $input['username']; // This is the username sent from the frontend

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
    
    if ($result->num_rows > 0) { //if query has notebooks, go thru all of them to send to frontend
        $notebooks = []; //for the json array

        while($row = $result->fetch_assoc()) {
            // Convert string to DateTime object for formatting
            $timeCreated = new DateTime($row['time_created']);
            $lastModified = new DateTime($row['last_modified']);
        
            $notebooks[] = [
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

        echo json_encode($notebooks);
    } else { //no notebooks for current user
        echo json_encode([]);
    }

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "500",
        "message" => "Database query failed"
    ]);
}
