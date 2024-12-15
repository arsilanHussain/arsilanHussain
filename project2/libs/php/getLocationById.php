<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

require_once("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if ($conn->connect_error) {
    echo json_encode([
        'status' => [
            'code' => 300,
            'name' => 'failure',
            'description' => 'Database connection failed',
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
        ],
        'data' => []
    ]);
    exit;
}

if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    echo json_encode([
        'status' => [
            'code' => 400,
            'name' => 'bad request',
            'description' => 'Missing or invalid ID',
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
        ],
        'data' => []
    ]);
    exit;
}

$id = intval($_GET['id']);

$query = $conn->prepare("SELECT id, name FROM location WHERE id = ?");
if (!$query) {
    echo json_encode([
        'status' => [
            'code' => 400,
            'name' => 'failure',
            'description' => 'Failed to prepare query: ' . $conn->error,
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
        ],
        'data' => []
    ]);
    exit;
}

$query->bind_param("i", $id);
$query->execute();
$result = $query->get_result();

if ($result->num_rows > 0) {
    $data = $result->fetch_assoc();
    echo json_encode([
        'status' => [
            'code' => 200,
            'name' => 'ok',
            'description' => 'Location found',
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
        ],
        'data' => $data
    ]);
} else {
    echo json_encode([
        'status' => [
            'code' => 404,
            'name' => 'not found',
            'description' => "No location found with ID $id",
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
        ],
        'data' => []
    ]);
}

$query->close();
$conn->close();
?>
