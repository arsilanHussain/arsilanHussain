<?php
/// get Weather for Modal 4 (Weather Modal) --- Had to do capital cities weather as country was too large and would not get a definitive answer

$countryToCapitalMap = [
    'AF' => 'Kabul',
    'AL' => 'Tirana',
    'DZ' => 'Algiers',
    'AS' => 'Pago Pago',
    'AD' => 'Andorra la Vella',
    'AO' => 'Luanda',
    'AG' => 'St. John\'s',
    'AR' => 'Buenos Aires',
    'AM' => 'Yerevan',
    'AU' => 'Canberra',
    'AT' => 'Vienna',
    'AZ' => 'Baku',
    'BS' => 'Nassau',
    'BH' => 'Manama',
    'BD' => 'Dhaka',
    'BB' => 'Bridgetown',
    'BY' => 'Minsk',
    'BE' => 'Brussels',
    'BZ' => 'Belmopan',
    'BJ' => 'Porto-Novo',
    'BM' => 'Hamilton',
    'BT' => 'Thimphu',
    'BO' => 'Sucre',
    'BA' => 'Sarajevo',
    'BW' => 'Gaborone',
    'BR' => 'Brasília',
    'BN' => 'Bandar Seri Begawan',
    'BG' => 'Sofia',
    'BF' => 'Ouagadougou',
    'BI' => 'Gitega',
    'CV' => 'Praia',
    'KH' => 'Phnom Penh',
    'CM' => 'Yaoundé',
    'CA' => 'Ottawa',
    'KY' => 'George Town',
    'CF' => 'Bangui',
    'TD' => 'N\'Djamena',
    'CL' => 'Santiago',
    'CN' => 'Beijing',
    'CO' => 'Bogotá',
    'KM' => 'Moroni',
    'CD' => 'Kinshasa',
    'CG' => 'Brazzaville',
    'CR' => 'San José',
    'HR' => 'Zagreb',
    'CU' => 'Havana',
    'CY' => 'Nicosia',
    'CZ' => 'Prague',
    'DK' => 'Copenhagen',
    'DJ' => 'Djibouti',
    'DM' => 'Roseau',
    'DO' => 'Santo Domingo',
    'EC' => 'Quito',
    'EG' => 'Cairo',
    'SV' => 'San Salvador',
    'GQ' => 'Malabo',
    'ER' => 'Asmara',
    'EE' => 'Tallinn',
    'SZ' => 'Mbabane',
    'ET' => 'Addis Ababa',
    'FJ' => 'Suva',
    'FI' => 'Helsinki',
    'FR' => 'Paris',
    'GA' => 'Libreville',
    'GM' => 'Banjul',
    'GE' => 'Tbilisi',
    'DE' => 'Berlin',
    'GH' => 'Accra',
    'GR' => 'Athens',
    'GD' => 'St. George\'s',
    'GT' => 'Guatemala City',
    'GN' => 'Conakry',
    'GW' => 'Bissau',
    'GY' => 'Georgetown',
    'HT' => 'Port-au-Prince',
    'HN' => 'Tegucigalpa',
    'HU' => 'Budapest',
    'IS' => 'Reykjavik',
    'IN' => 'New Delhi',
    'ID' => 'Jakarta',
    'IR' => 'Tehran',
    'IQ' => 'Baghdad',
    'IE' => 'Dublin',
    'IL' => 'Jerusalem',
    'IT' => 'Rome',
    'JM' => 'Kingston',
    'JP' => 'Tokyo',
    'JO' => 'Amman',
    'KZ' => 'Astana',
    'KE' => 'Nairobi',
    'KI' => 'Tarawa',
    'KP' => 'Pyongyang',
    'KR' => 'Seoul',
    'KW' => 'Kuwait City',
    'KG' => 'Bishkek',
    'LA' => 'Vientiane',
    'LV' => 'Riga',
    'LB' => 'Beirut',
    'LS' => 'Maseru',
    'LR' => 'Monrovia',
    'LY' => 'Tripoli',
    'LI' => 'Vaduz',
    'LT' => 'Vilnius',
    'LU' => 'Luxembourg',
    'MG' => 'Antananarivo',
    'MW' => 'Lilongwe',
    'MY' => 'Kuala Lumpur',
    'MV' => 'Malé',
    'ML' => 'Bamako',
    'MT' => 'Valletta',
    'MH' => 'Majuro',
    'MR' => 'Nouakchott',
    'MU' => 'Port Louis',
    'MX' => 'Mexico City',
    'FM' => 'Palikir',
    'MD' => 'Chisinau',
    'MC' => 'Monaco',
    'MN' => 'Ulaanbaatar',
    'ME' => 'Podgorica',
    'MA' => 'Rabat',
    'MZ' => 'Maputo',
    'MM' => 'Naypyidaw',
    'NA' => 'Windhoek',
    'NR' => 'Yaren',
    'NP' => 'Kathmandu',
    'NL' => 'Amsterdam',
    'NZ' => 'Wellington',
    'NI' => 'Managua',
    'NE' => 'Niamey',
    'NG' => 'Abuja',
    'NO' => 'Oslo',
    'OM' => 'Muscat',
    'PK' => 'Islamabad',
    'PW' => 'Ngerulmud',
    'PA' => 'Panama City',
    'PG' => 'Port Moresby',
    'PY' => 'Asunción',
    'PE' => 'Lima',
    'PH' => 'Manila',
    'PL' => 'Warsaw',
    'PT' => 'Lisbon',
    'QA' => 'Doha',
    'RO' => 'Bucharest',
    'RU' => 'Moscow',
    'RW' => 'Kigali',
    'WS' => 'Apia',
    'SM' => 'San Marino',
    'ST' => 'São Tomé',
    'SA' => 'Riyadh',
    'SN' => 'Dakar',
    'RS' => 'Belgrade',
    'SC' => 'Victoria',
    'SL' => 'Freetown',
    'SG' => 'Singapore',
    'SK' => 'Bratislava',
    'SI' => 'Ljubljana',
    'SB' => 'Honiara',
    'SO' => 'Mogadishu',
    'ZA' => 'Pretoria',
    'SS' => 'Juba',
    'ES' => 'Madrid',
    'LK' => 'Sri Jayawardenepura Kotte',
    'SD' => 'Khartoum',
    'SR' => 'Paramaribo',
    'SE' => 'Stockholm',
    'CH' => 'Bern',
    'SY' => 'Damascus',
    'TW' => 'Taipei',
    'TJ' => 'Dushanbe',
    'TZ' => 'Dodoma',
    'TH' => 'Bangkok',
    'TL' => 'Dili',
    'TG' => 'Lomé',
    'TO' => 'Nukuʻalofa',
    'TT' => 'Port of Spain',
    'TN' => 'Tunis',
    'TR' => 'Ankara',
    'TM' => 'Ashgabat',
    'TV' => 'Funafuti',
    'UG' => 'Kampala',
    'UA' => 'Kyiv',
    'AE' => 'Abu Dhabi',
    'GB' => 'London',
    'US' => 'Washington, D.C.',
    'UY' => 'Montevideo',
    'UZ' => 'Tashkent',
    'VU' => 'Port Vila',
    'VA' => 'Vatican City',
    'VE' => 'Caracas',
    'VN' => 'Hanoi',
    'YE' => 'Sana\'a',
    'ZM' => 'Lusaka',
    'ZW' => 'Harare'
];

if (isset($_POST['country_code'])) {
    $country_code = $_POST['country_code'];
    if (isset($countryToCapitalMap[$country_code])) {
        $city = $countryToCapitalMap[$country_code];
    } else {
        echo json_encode(['success' => false, 'message' => 'Country code not found']);
        exit;
    }
    $api_key = '949701521df0535f7356b0951378fd5f';
    $api_url = "https://api.openweathermap.org/data/2.5/forecast?q={$city}&cnt=2&units=metric&appid={$api_key}";
    $response = file_get_contents($api_url);
    $data = json_decode($response, true);
    if (isset($data['list'])) {
        $today = $data['list'][0];
        $tomorrow = $data['list'][1];
        echo json_encode([
            'success' => true,
            'city' => $city,
            'today' => [
                'temp' => $today['main']['temp'],
                'description' => $today['weather'][0]['description'],
                'icon' => $today['weather'][0]['icon']
            ],
            'tomorrow' => [
                'temp' => $tomorrow['main']['temp'],
                'description' => $tomorrow['weather'][0]['description'],
                'icon' => $tomorrow['weather'][0]['icon']
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Weather data not available']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
}
?>
