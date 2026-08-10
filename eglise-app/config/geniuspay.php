<?php

return [
    'api_key' => env('GENIUSPAY_API_KEY'),
    'api_secret' => env('GENIUSPAY_API_SECRET'),
    'webhook_secret' => env('GENIUSPAY_WEBHOOK_SECRET'),
    'base_url' => env('GENIUSPAY_BASE_URL', 'https://geniuspay.ci/api/v1'),
];
