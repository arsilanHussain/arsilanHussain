<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    $output['status'] = [
        'code' => 300,
        'name' => 'failure',
        'description' => 'database unavailable',
        'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
    ];
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);

if (empty($input['name']) || !is_string($input['name']) || empty($input['locationID']) || !is_numeric($input['locationID'])) {
    $output['status'] = [
        'code' => 400,
        'name' => 'failure',
        'description' => "Missing or invalid required fields: 'name' must be a string, 'locationID' must be numeric.",
        'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
    ];
    $output['data'] = [];
    echo json_encode($output);
    $conn->close();
    exit;
}

$name = trim($input['name']);
$locationID = (int)$input['locationID'];

$query = $conn->prepare('INSERT INTO department (name, locationID) VALUES (?, ?)');
$query->bind_param("si", $name, $locationID);

if ($query->execute()) {
    $output['status'] = [
        'code' => 200,
        'name' => 'ok',
        'description' => 'Department inserted successfully.',
        'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
    ];
    $output['data'] = ['insertedID' => $conn->insert_id];
    echo json_encode($output);
} else {
    $output['status'] = [
        'code' => 400,
        'name' => 'failure',
        'description' => 'Database insert failed. ' . $query->error,
        'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
    ];
    $output['data'] = [];
    echo json_encode($output);
}
$conn->close();

?>
