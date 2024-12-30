<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if ($conn->connect_errno) {
    echo json_encode([
        'status' => [
            'code' => 300,
            'name' => 'failure',
            'description' => 'Database unavailable',
            'returnedIn' => round((microtime(true) - $executionStartTime) * 1000, 2) . " ms"
        ],
        'data' => []
    ]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);

if (
    empty($input['firstName']) || 
    empty($input['lastName']) || 
    empty($input['email']) || 
    empty($input['departmentID'])
) {
    echo json_encode([
        'status' => [
            'code' => 400,
            'name' => 'bad request',
            'description' => 'Missing required fields',
            'returnedIn' => round((microtime(true) - $executionStartTime) * 1000, 2) . " ms"
        ],
        'data' => []
    ]);
    exit;
}

$firstName = $conn->real_escape_string($input['firstName']);
$lastName = $conn->real_escape_string($input['lastName']);
$email = $conn->real_escape_string($input['email']);
$jobTitle = isset($input['jobTitle']) ? $conn->real_escape_string($input['jobTitle']) : null;
$departmentID = (int)$input['departmentID'];

$query = $conn->prepare('INSERT INTO personnel (firstName, lastName, email, jobTitle, departmentID) VALUES (?, ?, ?, ?, ?)');
$query->bind_param(
    "ssssi", 
    $firstName, 
    $lastName, 
    $email, 
    $jobTitle, 
    $departmentID
);

if (!$query->execute()) {
    echo json_encode([
        'status' => [
            'code' => 400,
            'name' => 'failure',
            'description' => 'Insert failed: ' . $query->error,
            'returnedIn' => round((microtime(true) - $executionStartTime) * 1000, 2) . " ms"
        ],
        'data' => []
    ]);
} else {
    echo json_encode([
        'status' => [
            'code' => 200,
            'name' => 'ok',
            'description' => 'Personnel added successfully',
            'returnedIn' => round((microtime(true) - $executionStartTime) * 1000, 2) . " ms"
        ],
        'data' => ['insertedID' => $conn->insert_id]
    ]);
}

$conn->close();

?>
