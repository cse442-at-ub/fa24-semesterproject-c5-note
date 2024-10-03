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
    

    //query to get notebooks for the specific logged in user
    $stmt = $connection->prepare("SELECT title, description, color FROM notebooks WHERE username = ?");
    $stmt->bind_param("s", $loggedInUsername); //inputs loggedInUser for ? ;protecting from poissible sql injection
    $stmt->execute(); //query sent to db
    
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) { //if query has notebooks, go thru all of them to send to frontend
        $notebooks = []; //for the json array

        while($row = $result->fetch_assoc()) {
            
            $notebooks[] = $row;
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