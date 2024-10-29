<?php
// Get currency code for modal 3's currency converter, had to use seperate api as some countries would not come back with information

if (isset($_POST['country_code'])) {
    $country_code = $_POST['country_code'];
    $api_url = 'https://restcountries.com/v3.1/alpha/' . $country_code;
    $response = file_get_contents($api_url);
    $data = json_decode($response, true);
    if (isset($data[0]['currencies'])) {
        $currency_code = array_keys($data[0]['currencies'])[0]; 
        echo json_encode([
            'success' => true,
            'currency_code' => $currency_code
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Currency code not found.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request.']);
}
?>
