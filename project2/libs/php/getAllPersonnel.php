<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port);

if (mysqli_connect_errno()) {
    echo json_encode([
        "status" => [
            "code" => 300,
            "name" => "failure",
            "description" => "database unavailable"
        ],
        "data" => []
    ]);
    exit;
}

$query = "
    SELECT 
        p.id,
        p.firstName,
        p.lastName,
        p.email,
        p.departmentID,
        d.name AS department,
        d.locationID,
        l.name AS location
    FROM
        personnel p
    LEFT JOIN
        department d ON p.departmentID = d.id
    LEFT JOIN
        location l ON d.locationID = l.id
";

$result = $conn->query($query);

if (!$result) {
    echo json_encode([
        "status" => [
            "code" => 400,
            "name" => "failure",
            "description" => "query failed"
        ],
        "data" => []
    ]);
    exit;
}

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode([
    "status" => [
        "code" => 200,
        "name" => "ok",
        "description" => "success"
    ],
    "data" => $data
]);

$conn->close();
?>
