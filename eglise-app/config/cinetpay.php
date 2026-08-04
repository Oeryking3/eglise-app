<?php

return [
    'api_key' => env('CINETPAY_API_KEY'),
    'api_password' => env('CINETPAY_API_PASSWORD'),
    'currency' => env('CINETPAY_CURRENCY', 'XOF'),
    'base_url' => env('CINETPAY_BASE_URL', 'https://api.cinetpay.net/v1'),
];
