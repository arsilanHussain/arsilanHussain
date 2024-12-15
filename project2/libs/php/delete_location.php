<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    echo json_encode([
        'status' => [
            'code' => 300,
            'name' => 'failure',
            'description' => 'Database unavailable',
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
        ]
    ]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);

if (empty($input['id'])) {
    echo json_encode([
        'status' => [
            'code' => 400,
            'name' => 'bad request',
            'description' => 'Missing required field: id',
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
        ]
    ]);
    exit;
}

$id = (int)$input['id'];

$dependencyCheck = $conn->prepare("
    SELECT COUNT(*) AS dependencyCount
    FROM department
    WHERE locationID = ?
");
$dependencyCheck->bind_param("i", $id);
$dependencyCheck->execute();
$result = $dependencyCheck->get_result();
$dependencyData = $result->fetch_assoc();

if ($dependencyData['dependencyCount'] > 0) {
    echo json_encode([
        'status' => [
            'code' => 403,
            'name' => 'forbidden',
            'description' => 'Cannot delete this location because there are departments linked to it.',
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
        ]
    ]);
    exit;
}

$query = $conn->prepare('DELETE FROM location WHERE id = ?');
$query->bind_param("i", $id);

if (!$query->execute()) {
    echo json_encode([
        'status' => [
            'code' => 400,
            'name' => 'failure',
            'description' => 'Delete failed: ' . $query->error,
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
        ]
    ]);
} else {
    echo json_encode([
        'status' => [
            'code' => 200,
            'name' => 'ok',
            'description' => 'Location deleted successfully',
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
        ]
    ]);
}

$conn->close();

?>
