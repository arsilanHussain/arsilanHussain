<?php
/// get News for Modal 5 (News Articles)

$newsDataApiKey = 'pub_56879dc1506595592b9b3993eb96feab8605a';
$countryCodeMap = [
    'AF' => 'af',  'AL' => 'al',  'DZ' => 'dz',  'AS' => 'as',  'AD' => 'ad',
    'AO' => 'ao',  'AI' => 'ai',  'AG' => 'ag',  'AR' => 'ar',  'AM' => 'am',
    'AW' => 'aw',  'AU' => 'au',  'AT' => 'at',  'AZ' => 'az',  'BS' => 'bs',
    'BH' => 'bh',  'BD' => 'bd',  'BB' => 'bb',  'BY' => 'by',  'BE' => 'be',
    'BZ' => 'bz',  'BJ' => 'bj',  'BM' => 'bm',  'BT' => 'bt',  'BO' => 'bo',
    'BA' => 'ba',  'BW' => 'bw',  'BR' => 'br',  'BN' => 'bn',  'BG' => 'bg',
    'BF' => 'bf',  'BI' => 'bi',  'KH' => 'kh',  'CM' => 'cm',  'CA' => 'ca',
    'CV' => 'cv',  'KY' => 'ky',  'CF' => 'cf',  'TD' => 'td',  'CL' => 'cl',
    'CN' => 'cn',  'CO' => 'co',  'KM' => 'km',  'CG' => 'cg',  'CR' => 'cr',
    'HR' => 'hr',  'CU' => 'cu',  'CY' => 'cy',  'CZ' => 'cz',  'DK' => 'dk',
    'DJ' => 'dj',  'DM' => 'dm',  'DO' => 'do',  'EC' => 'ec',  'EG' => 'eg',
    'SV' => 'sv',  'GQ' => 'gq',  'ER' => 'er',  'EE' => 'ee',  'ET' => 'et',
    'FJ' => 'fj',  'FI' => 'fi',  'FR' => 'fr',  'GA' => 'ga',  'GM' => 'gm',
    'GE' => 'ge',  'DE' => 'de',  'GH' => 'gh',  'GR' => 'gr',  'GD' => 'gd',
    'GT' => 'gt',  'GN' => 'gn',  'GW' => 'gw',  'GY' => 'gy',  'HT' => 'ht',
    'HN' => 'hn',  'HK' => 'hk',  'HU' => 'hu',  'IS' => 'is',  'IN' => 'in',
    'ID' => 'id',  'IR' => 'ir',  'IQ' => 'iq',  'IE' => 'ie',  'IL' => 'il',
    'IT' => 'it',  'JM' => 'jm',  'JP' => 'jp',  'JO' => 'jo',  'KZ' => 'kz',
    'KE' => 'ke',  'KI' => 'ki',  'KP' => 'kp',  'KR' => 'kr',  'KW' => 'kw',
    'KG' => 'kg',  'LA' => 'la',  'LV' => 'lv',  'LB' => 'lb',  'LS' => 'ls',
    'LR' => 'lr',  'LY' => 'ly',  'LI' => 'li',  'LT' => 'lt',  'LU' => 'lu',
    'MO' => 'mo',  'MG' => 'mg',  'MW' => 'mw',  'MY' => 'my',  'MV' => 'mv',
    'ML' => 'ml',  'MT' => 'mt',  'MH' => 'mh',  'MR' => 'mr',  'MU' => 'mu',
    'MX' => 'mx',  'FM' => 'fm',  'MD' => 'md',  'MC' => 'mc',  'MN' => 'mn',
    'ME' => 'me',  'MA' => 'ma',  'MZ' => 'mz',  'MM' => 'mm',  'NA' => 'na',
    'NR' => 'nr',  'NP' => 'np',  'NL' => 'nl',  'NZ' => 'nz',  'NI' => 'ni',
    'NE' => 'ne',  'NG' => 'ng',  'NO' => 'no',  'OM' => 'om',  'PK' => 'pk',
    'PW' => 'pw',  'PA' => 'pa',  'PG' => 'pg',  'PY' => 'py',  'PE' => 'pe',
    'PH' => 'ph',  'PL' => 'pl',  'PT' => 'pt',  'QA' => 'qa',  'RO' => 'ro',
    'RU' => 'ru',  'RW' => 'rw',  'KN' => 'kn',  'LC' => 'lc',  'VC' => 'vc',
    'WS' => 'ws',  'SM' => 'sm',  'ST' => 'st',  'SA' => 'sa',  'SN' => 'sn',
    'RS' => 'rs',  'SC' => 'sc',  'SL' => 'sl',  'SG' => 'sg',  'SK' => 'sk',
    'SI' => 'si',  'SB' => 'sb',  'SO' => 'so',  'ZA' => 'za',  'ES' => 'es',
    'LK' => 'lk',  'SD' => 'sd',  'SR' => 'sr',  'SE' => 'se',  'CH' => 'ch',
    'SY' => 'sy',  'TW' => 'tw',  'TJ' => 'tj',  'TZ' => 'tz',  'TH' => 'th',
    'TL' => 'tl',  'TG' => 'tg',  'TO' => 'to',  'TT' => 'tt',  'TN' => 'tn',
    'TR' => 'tr',  'TM' => 'tm',  'UG' => 'ug',  'UA' => 'ua',  'AE' => 'ae',
    'GB' => 'gb',  'US' => 'us',  'UY' => 'uy',  'UZ' => 'uz',  'VU' => 'vu',
    'VA' => 'va',  'VE' => 've',  'VN' => 'vn',  'YE' => 'ye',  'ZM' => 'zm',
    'ZW' => 'zw',
    'PS' => 'palestine', 
];
header('Content-Type: application/json');
$countryCode = isset($_POST['countryCode']) ? $_POST['countryCode'] : '';
if (empty($countryCode)) {
    echo json_encode(['error' => 'No country code provided.']);
    exit;
}
if (isset($countryCodeMap[$countryCode])) {
    $query = $countryCodeMap[$countryCode]; 
    $newsDataUrl = "https://newsdata.io/api/1/news?apikey={$newsDataApiKey}&q={$query}&language=en";
    $newsResponse = file_get_contents($newsDataUrl);
    if ($newsResponse === false) {
        echo json_encode(['error' => 'Unable to fetch news from NewsData.io.']);
        exit;
    }
    $newsData = json_decode($newsResponse, true);
    if (isset($newsData['results']) && count($newsData['results']) > 0) {
        echo json_encode($newsData['results']);
    } else {
        echo json_encode(['error' => 'No news available for this country.']);
    }
} else {
    echo json_encode(['error' => 'Invalid or unsupported country code.']);
}

?>