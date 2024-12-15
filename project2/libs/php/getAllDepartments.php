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
            'description' => 'database unavailable',
            'returnedIn' => round((microtime(true) - $executionStartTime) * 1000, 2) . " ms"
        ],
        'data' => []
    ]);
    exit;
}

$query = '
    SELECT 
        d.id AS departmentID,
        d.name AS departmentName,
        l.id AS locationID, 
        l.name AS locationName
    FROM 
        department d
    LEFT JOIN 
        location l ON d.locationID = l.id
';

$result = $conn->query($query);

if (!$result) {
    echo json_encode([
        'status' => [
            'code' => 400,
            'name' => 'failure',
            'description' => 'query failed: ' . $conn->error,
            'returnedIn' => round((microtime(true) - $executionStartTime) * 1000, 2) . " ms"
        ],
        'data' => []
    ]);
    $conn->close();
    exit;
}

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode([
    'status' => [
        'code' => 200,
        'name' => 'ok',
        'description' => 'success',
        'returnedIn' => round((microtime(true) - $executionStartTime) * 1000, 2) . " ms"
    ],
    'data' => $data
]);

$conn->close();
?>
