<?php
///  Country info for Modal 1 (Country Info)
if (isset($_GET['countryCode'])) {
    $countryCode = strtoupper(urlencode($_GET['countryCode'])); 
    $apiUrl = "https://restcountries.com/v3.1/alpha/$countryCode";
    $response = file_get_contents($apiUrl);
    if ($response) {
        $data = json_decode($response, true);
        if (isset($data[0])) {
            $countryData = [
                'name' => $data[0]['name']['common'],
                'capital' => $data[0]['capital'][0],
                'population' => $data[0]['population'],
                'currency' => implode(', ', array_keys($data[0]['currencies']))
            ];
            echo json_encode(['success' => true, 'country' => $countryData]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Country not found']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'API request failed']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'No country code provided']);
}
?>
