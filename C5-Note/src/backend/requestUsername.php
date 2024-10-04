<?php

$config = file_get_contents("../config.json");
$data = json_decode($config);
$username = $data->username;
$password = $data->password;
$db_name = $data->db_name;

$json = json_decode(file_get_contents("php://input"));

$request_email = $json->email;

$connection = new mysqli("localhost:3306", $username, $password, $db_name);

$statement = $connection->prepare("SELECT * FROM users WHERE email = ?");

$statement->bind_param("s", $request_email);

$result = $statement->execute();
if($result) {
        $output = $statement->get_result();
}

if ($result && $output->num_rows == 1) {
    $record = $output->fetch_assoc();
    $request_username = $record["username"];

    mail($request_email,
        "C5 Note Username Reminder",
        "The username associated with this email is " . $request_username . ".");

    http_response_code(200);
    die(json_encode([
        "status" => "success",
        "message" => "An email has been sent containing the username associated with " . $request_email . "."
    ]));
}
else {

    http_response_code(400);
    die(json_encode([
        "status" => "failed",
        "message" => "There is no account associated with " . $request_email . "."
    ]));
}