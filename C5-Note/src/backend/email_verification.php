<?php

$config = file_get_contents("../config.json");
$data = json_decode($config);

$username = $data->username;
$password = $data->password;
$db_name = $data->db_name;

$json = json_decode(file_get_contents("php://input"));

$signup_code = $json->code;
$signup_pass = password_hash($json->password, PASSWORD_DEFAULT);
$signup_email = $json->email;

$mysqli = new mysqli("localhost:3306", $username, $password, $db_name);

if ($mysqli->connect_error) {
    die("Could not connect to the database");
}

try {
    // Check if the code is valid for the given email
    $stmt = $mysqli->prepare("SELECT * FROM email_codes WHERE email = ? AND code = ?");
    if (!$stmt) {
        throw new Exception("Error preparing statement: " . $mysqli->error);
    }

    $stmt->bind_param("ss", $signup_email, $signup_code);
    $stmt->execute();
    $result = $stmt->get_result();

    // If no matching record is found
    if ($result->num_rows == 0) {
        die(json_encode([
            "status" => "400",
            "message" => "Email Invalid or Verification code invalid"
        ]));
    }

    $row = $result->fetch_assoc();

    // Check if the verification code has expired
    if (time() - $row['time'] > 300) {
        $stmt->close();

        // Delete expired code
        $stmt1 = $mysqli->prepare("DELETE FROM email_codes WHERE email = ?");
        if (!$stmt1) {
            throw new Exception("Error preparing statement for deletion: " . $mysqli->error);
        }

        $stmt1->bind_param("s", $signup_email);
        $stmt1->execute();
        $stmt1->close();

        die(json_encode([
            "status" => "400",
            "message" => "Verification Code Expired, Please re-signup"
        ]));
    }

    // Get the username associated with the email from the email_codes table
    $users_name = $row['username'];
    $stmt->close();

    // Insert the new user into the users table
    $stmt = $mysqli->prepare("INSERT INTO users (username, password, email) VALUES (?, ?, ?)");
    if (!$stmt) {
        throw new Exception("Error preparing statement for insertion into users: " . $mysqli->error);
    }

    $stmt->bind_param("sss", $users_name, $signup_pass, $signup_email);
    $stmt->execute();
    $stmt->close();

    // Delete the email code after successful registration
    $stmt1 = $mysqli->prepare("DELETE FROM email_codes WHERE email = ?");
    if (!$stmt1) {
        throw new Exception("Error preparing statement for deleting email code: " . $mysqli->error);
    }

    $stmt1->bind_param("s", $signup_email);
    $stmt1->execute();
    $stmt1->close();

    // Return success response
    http_response_code(201);
    die(json_encode([
        "status" => "200",
        "message" => "Successfully Registered Account"
    ]));
} catch (Exception $e) {
    // Log the error for debugging
    error_log($e->getMessage());

    // Return error response
    http_response_code(409);
    die(json_encode([
        "status" => "500",
        "message" => "Internal Server Error"
    ]));
}
?>
