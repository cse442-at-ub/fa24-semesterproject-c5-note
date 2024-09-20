<?php
$config = file_get_contents("../config.json");
$data = json_decode($config);

$servername = "localhost:3306";
$username = $data->username;
$password = $data->password;
$db_name = $data->db_name;

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);
// Check connection
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}

$sql = "INSERT INTO users (image) VALUES ('$filename')";

if (mysqli_query($conn, $sql)) {
  echo "New record created successfully";
} else {
  echo "Error: " . $sql . "<br>" . mysqli_error($conn);
}

mysqli_close($conn);
?> 