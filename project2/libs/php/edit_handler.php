<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);
if ($conn->connect_error) {
    echo json_encode([
        'status' => ['code' => 300, 'name' => 'failure', 'description' => 'Database connection failed'],
        'data' => []
    ]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);
$type = $input['type'];
$id = intval($input['id']);

try {
    switch ($type) {
        case 'personnel':
            $firstName = $conn->real_escape_string($input['firstName']);
            $lastName = $conn->real_escape_string($input['lastName']);
            $email = $conn->real_escape_string($input['email']);
            $jobTitle = $conn->real_escape_string($input['jobTitle']);
            $departmentID = intval($input['departmentID']);

            $updateSQL = "
                UPDATE personnel 
                SET firstName='$firstName', lastName='$lastName', email='$email', 
                    jobTitle='$jobTitle', departmentID=$departmentID 
                WHERE id=$id
            ";
            if (!$conn->query($updateSQL)) {
                throw new Exception("Failed to update personnel: " . $conn->error);
            }
            break;

        case 'department':
            if (empty($input['id']) || empty($input['name']) || !isset($input['locationID'])) {
                throw new Exception("Missing required fields for department update.");
            }

            $name = $conn->real_escape_string($input['name']);
            $locationID = intval($input['locationID']);

            $updateSQL = "
                UPDATE department 
                SET name='$name', locationID=$locationID 
                WHERE id=$id
            ";
            if (!$conn->query($updateSQL)) {
                throw new Exception("Failed to update department: " . $conn->error);
            }
            break;

        case 'location':
            $name = $conn->real_escape_string($input['name']);

            $updateSQL = "
                UPDATE location 
                SET name='$name' 
                WHERE id=$id
            ";
            if (!$conn->query($updateSQL)) {
                throw new Exception("Failed to update location: " . $conn->error);
            }
            break;

        default:
            throw new Exception("Invalid type for editing.");
    }

    echo json_encode(['status' => ['code' => 200, 'name' => 'success', 'description' => 'Updated successfully']]);
} catch (Exception $e) {
    echo json_encode(['status' => ['code' => 400, 'name' => 'failure', 'description' => $e->getMessage()]]);
} finally {
    $conn->close();
}
?>
