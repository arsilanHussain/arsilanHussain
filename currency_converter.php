<?php
//// Currency Converter for Modal 3 (currency converter)

if (isset($_POST['base_currency']) && isset($_POST['target_currency'])) {
    $base_currency = $_POST['base_currency'];
    $target_currency = $_POST['target_currency'];
    $api_key = '0da4da33ff11d2b71444919e';
    $api_url = 'https://v6.exchangerate-api.com/v6/' . $api_key . '/latest/' . $base_currency;
    $response = file_get_contents($api_url);
    $data = json_decode($response, true);
    if (isset($data['conversion_rates'][$target_currency])) {
        $rate = $data['conversion_rates'][$target_currency];
        echo json_encode([
            'success' => true,
            'rate' => $rate,
            'base_currency' => $base_currency,
            'target_currency' => $target_currency
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Currency conversion data not available.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request.']);
}
?>
