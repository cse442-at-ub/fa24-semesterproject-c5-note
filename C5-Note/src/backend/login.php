<?php

$config = file_get_contents("../config.json");
$data = json_decode($config);

$username = $data->username;
$password = $data->password;
$db_name = $data->db_name;

$json = json_decode(file_get_contents("php://input"));

$login_username = $json->username;
$login_password = $json->password;


$connection = new mysqli("localhost:3306", $username, $password, $db_name);


if($connection->connect_error) {
    die("Could not connect to the database");
}

try {
    // Prepare the SQL statement
    $stmt = $connection->prepare("SELECT * FROM users WHERE username = ?");

    // Bind the username parameter to the prepared statement
    $stmt->bind_param("s", $login_username); // "s" stands for a string

    // Execute the statement
    $stmt->execute();

    // Get the result
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
    $record = $result->fetch_assoc();
    $hashed_password = $record["password"];
    $user_id = $record["user_id"];
    $token = random_bytes(32);
    $hashed_token = hash("sha256", $token);



    if(password_verify($login_password, $hashed_password)) {

         // Prepare the SQL statement
         $stmt = $connection->prepare("DELETE FROM active_users WHERE user_id = ?");

         // Bind the parameters to the prepared statement
         $stmt->bind_param("i", $user_id); // "i" for integer and "s" for string
 
         // Execute the statement
         $stmt->execute();
 
         // Close the statement
         $stmt->close();

        // Prepare the SQL statement
        $stmt = $connection->prepare("INSERT INTO active_users (user_id, token) VALUES (?, ?)");

        // Bind the parameters to the prepared statement
        $stmt->bind_param("is", $user_id, $hashed_token); // "i" for integer and "s" for string

        // Execute the statement
        $stmt->execute();

        // Close the statement
        $stmt->close();

        http_response_code(201);
        setcookie("username", htmlspecialchars($login_username, ENT_QUOTES, 'UTF-8'), $expires_or_options=time()+3600,$path='/');
        setcookie("token", "$token", $expires_or_options=time()+3600,$path='/');
        die(json_encode([
            "status" => "valid",
            "message" => "correct"
        ]));
    }
    else {

        http_response_code(401);
        die(json_encode([
            "status" => "failed",
            "message" => "Incorrect credentials"
        ]));

    }
    }
    else {
    
    http_response_code(401);
    die(json_encode([
        "status" => "failed",
        "message" => "Incorrect credentials"
    ]));
    }
    }
catch (Exception $e) {

    http_response_code(401);
    die(json_encode([
    "status" => "failed",
    "message" => "Database Error"
    ]));
}