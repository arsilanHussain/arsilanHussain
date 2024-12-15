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
        ],
        'data' => []
    ]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);

error_log("Received input: " . print_r($input, true));

if (empty($input['type']) || empty($input['id'])) {
    echo json_encode([
        'status' => [
            'code' => 400,
            'name' => 'bad request',
            'description' => 'Missing required fields: type or ID',
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
        ],
        'data' => []
    ]);
    exit;
}

$type = $input['type'];
$id = intval($input['id']);

try {
    $query = null;

    switch ($type) {
        case 'location':
            if (empty($input['name'])) {
                throw new Exception('Missing required field: name');
            }

            $query = $conn->prepare('UPDATE location SET name = ? WHERE id = ?');
            $query->bind_param("si", $input['name'], $id);
            break;

            case 'department':
                if (empty($input['name']) || !isset($input['locationID'])) {
                    throw new Exception('Missing required fields: name or locationID');
                }
            
                $query = $conn->prepare('UPDATE department SET name = ?, locationID = ? WHERE id = ?');
                $query->bind_param("sii", $input['name'], $input['locationID'], $id);
                break;
            

                case 'personnel':
                    if (
                        empty($input['firstName']) || empty($input['lastName']) || 
                        empty($input['email']) || !isset($input['departmentID'])
                    ) {
                        throw new Exception('Missing required fields for personnel');
                    }
                
                    $query = $conn->prepare('
                        UPDATE personnel 
                        SET firstName = ?, lastName = ?, email = ?, departmentID = ? 
                        WHERE id = ?
                    ');
                    $query->bind_param(
                        "sssii", 
                        $input['firstName'], $input['lastName'], 
                        $input['email'], $input['departmentID'], $id
                    );
                    break;
                
                
                

        default:
            throw new Exception('Unknown type: ' . $type);
    }

    if (!$query->execute()) {
        throw new Exception('Database error: ' . $query->error);
    }

    echo json_encode([
        'status' => [
            'code' => 200,
            'name' => 'ok',
            'description' => ucfirst($type) . ' updated successfully',
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
        ],
        'data' => ['affectedRows' => $query->affected_rows]
    ]);

} catch (Exception $e) {
    error_log("Exception caught: " . $e->getMessage());
    echo json_encode([
        'status' => [
            'code' => 500,
            'name' => 'failure',
            'description' => $e->getMessage(),
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
        ],
        'data' => []
    ]);
} finally {
    if ($query) $query->close();
    $conn->close();
}
?>
