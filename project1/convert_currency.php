<?php
header("Content-Type: application/json");
$data = json_decode(file_get_contents('php://input'), true);
if (isset($data['base_currency'], $data['target_currency'], $data['amount'])) {
    $baseCurrency = strtoupper(trim($data['base_currency']));
    $targetCurrency = strtoupper(trim($data['target_currency']));
    $amount = floatval($data['amount']); 
    if (empty($baseCurrency) || empty($targetCurrency) || $amount <= 0) {
        echo json_encode(['success' => false, 'message' => 'Base currency, target currency, and a positive amount are required.']);
        exit;
    }
    $apiKey = '0da4da33ff11d2b71444919e'; 
    $apiUrl = "https://v6.exchangerate-api.com/v6/{$apiKey}/latest/{$baseCurrency}";
    $response = @file_get_contents($apiUrl);
    if ($response === FALSE) {
        echo json_encode(['success' => false, 'message' => 'Unable to fetch conversion rates from the API.']);
        exit;
    }
    $apiData = json_decode($response, true);
    if (isset($apiData['conversion_rates'][$targetCurrency])) {
        $conversionRate = $apiData['conversion_rates'][$targetCurrency];
        $convertedAmount = $conversionRate * $amount;
        echo json_encode([
            'success' => true,
            'rate' => $conversionRate,
            'converted_amount' => $convertedAmount,
            'base_currency' => $baseCurrency,
            'target_currency' => $targetCurrency
        ]);
    } elseif (isset($apiData['error-type'])) {
        echo json_encode(['success' => false, 'message' => $apiData['error-type']]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Conversion rate not found.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request. Base currency, target currency, and amount are required.']);
}
?>
