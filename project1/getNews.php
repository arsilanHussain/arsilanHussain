<?php
/// get News for Modal 5 (News Articles)

$newsDataApiKey = 'pub_56879dc1506595592b9b3993eb96feab8605a';
$countryCodeMap = [
    'AF' => 'af',  'AX' => 'aland',  'AL' => 'al',  'DZ' => 'dz',  'AS' => 'as',  'AD' => 'ad',  'AO' => 'ao',  
    'AI' => 'ai',  'AQ' => 'antarctica',  'AG' => 'ag',  'AR' => 'ar',  'AM' => 'am',  'AW' => 'aw',  'AU' => 'au',  
    'AT' => 'at',  'AZ' => 'az',  'BS' => 'bs',  'BH' => 'bh',  'BD' => 'bd',  'BB' => 'bb',  'BY' => 'by',  
    'BE' => 'be',  'BZ' => 'bz',  'BJ' => 'bj',  'BM' => 'bm',  'BT' => 'bt',  'BO' => 'bo',  'BQ' => 'bonaire',  
    'BA' => 'ba',  'BW' => 'bw',  'BV' => 'bouvet',  'BR' => 'br',  'IO' => 'british-indian-ocean',  
    'BN' => 'bn',  'BG' => 'bg',  'BF' => 'bf',  'BI' => 'bi',  'CV' => 'cv',  'KH' => 'kh',  'CM' => 'cm',  
    'CA' => 'ca',  'KY' => 'ky',  'CF' => 'cf',  'TD' => 'td',  'CL' => 'cl',  'CN' => 'cn',  'CX' => 'christmas',  
    'CC' => 'cocos',  'CO' => 'co',  'KM' => 'km',  'CG' => 'cg',  'CD' => 'cd',  'CK' => 'ck',  'CR' => 'cr',  
    'HR' => 'hr',  'CU' => 'cu',  'CW' => 'cw',  'CY' => 'cy',  'CZ' => 'cz',  'DK' => 'dk',  'DJ' => 'dj',  
    'DM' => 'dm',  'DO' => 'do',  'EC' => 'ec',  'EG' => 'eg',  'SV' => 'sv',  'GQ' => 'gq',  'ER' => 'er',  
    'EE' => 'ee',  'SZ' => 'sz',  'ET' => 'et',  'FK' => 'falkland',  'FO' => 'fo',  'FJ' => 'fj',  'FI' => 'fi',  
    'FR' => 'fr',  'GF' => 'guyane',  'PF' => 'polynesia',  'TF' => 'french-southern',  'GA' => 'ga',  
    'GM' => 'gm',  'GE' => 'ge',  'DE' => 'de',  'GH' => 'gh',  'GI' => 'gi',  'GR' => 'gr',  'GL' => 'gl',  
    'GD' => 'gd',  'GP' => 'gp',  'GU' => 'gu',  'GT' => 'gt',  'GG' => 'gg',  'GN' => 'gn',  'GW' => 'gw',  
    'GY' => 'gy',  'HT' => 'ht',  'HM' => 'heard',  'VA' => 'vatican',  'HN' => 'hn',  'HK' => 'hk',  'HU' => 'hu',  
    'IS' => 'is',  'IN' => 'in',  'ID' => 'id',  'IR' => 'ir',  'IQ' => 'iq',  'IE' => 'ie',  'IM' => 'im',  
    'IL' => 'il',  'IT' => 'it',  'JM' => 'jm',  'JP' => 'jp',  'JE' => 'je',  'JO' => 'jo',  'KZ' => 'kz',  
    'KE' => 'ke',  'KI' => 'ki',  'KP' => 'kp',  'KR' => 'kr',  'KW' => 'kw',  'KG' => 'kg',  'LA' => 'la',  
    'LV' => 'lv',  'LB' => 'lb',  'LS' => 'ls',  'LR' => 'lr',  'LY' => 'ly',  'LI' => 'li',  'LT' => 'lt',  
    'LU' => 'lu',  'MO' => 'mo',  'MG' => 'mg',  'MW' => 'mw',  'MY' => 'my',  'MV' => 'mv',  'ML' => 'ml',  
    'MT' => 'mt',  'MH' => 'mh',  'MQ' => 'mq',  'MR' => 'mr',  'MU' => 'mu',  'YT' => 'yt',  'MX' => 'mx',  
    'FM' => 'fm',  'MD' => 'md',  'MC' => 'mc',  'MN' => 'mn',  'ME' => 'me',  'MS' => 'ms',  'MA' => 'ma',  
    'MZ' => 'mz',  'MM' => 'mm',  'NA' => 'na',  'NR' => 'nr',  'NP' => 'np',  'NL' => 'nl',  'NC' => 'new-caledonia',  
    'NZ' => 'nz',  'NI' => 'ni',  'NE' => 'ne',  'NG' => 'ng',  'NU' => 'nu',  'NF' => 'norfolk',  'MK' => 'mk',  
    'MP' => 'mp',  'NO' => 'no',  'OM' => 'om',  'PK' => 'pk',  'PW' => 'pw',  'PS' => 'palestine',  'PA' => 'pa',  
    'PG' => 'pg',  'PY' => 'py',  'PE' => 'pe',  'PH' => 'ph',  'PN' => 'pitcairn',  'PL' => 'pl',  'PT' => 'pt',  
    'PR' => 'pr',  'QA' => 'qa',  'RO' => 'ro',  'RU' => 'ru',  'RW' => 'rw',  'RE' => 're',  'BL' => 'st-barthelemy',  
    'SH' => 'st-helena',  'KN' => 'kn',  'LC' => 'lc',  'MF' => 'st-martin',  'PM' => 'st-pierre',  'VC' => 'vc',  
    'WS' => 'ws',  'SM' => 'sm',  'ST' => 'st',  'SA' => 'sa',  'SN' => 'sn',  'RS' => 'rs',  'SC' => 'sc',  
    'SL' => 'sl',  'SG' => 'sg',  'SX' => 'sint-maarten',  'SK' => 'sk',  'SI' => 'si',  'SB' => 'sb',  'SO' => 'so',  
    'ZA' => 'za',  'GS' => 'south-georgia',  'SS' => 'ss',  'ES' => 'es',  'LK' => 'lk',  'SD' => 'sd',  'SR' => 'sr',  
    'SJ' => 'svalbard',  'SE' => 'se',  'CH' => 'ch',  'SY' => 'sy',  'TW' => 'tw',  'TJ' => 'tj',  'TZ' => 'tz',  
    'TH' => 'th',  'TL' => 'tl',  'TG' => 'tg',  'TK' => 'tk',  'TO' => 'to',  'TT' => 'tt',  'TN' => 'tn',  
    'TR' => 'tr',  'TM' => 'tm',  'TC' => 'turks-and-caicos',  'TV' => 'tv',  'UG' => 'ug',  'UA' => 'ua',  
    'AE' => 'ae',  'GB' => 'gb',  'US' => 'us',  'UM' => 'us-minor-outlying',  'UY' => 'uy',  'UZ' => 'uz',  
    'VU' => 'vu',  'VE' => 've',  'VN' => 'vn',  'VG' => 'vg',  'VI' => 'vi',  'WF' => 'wf',  'EH' => 'western-sahara',  
    'YE' => 'ye',  'ZM' => 'zm',  'ZW' => 'zw'
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