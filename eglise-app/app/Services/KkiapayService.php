<?php

namespace App\Services;

use Kkiapay\Kkiapay;

class KkiapayService
{
    private Kkiapay $client;

    public function __construct()
    {
        $this->client = new Kkiapay(
            config('kkiapay.public_key'),
            config('kkiapay.private_key'),
            config('kkiapay.secret_key'),
            (bool) config('kkiapay.sandbox'),
        );
    }

    /**
     * Le SDK renvoie soit l'objet JSON décodé attendu, soit — après 3 tentatives
     * échouées — un simple code HTTP entier (ex: transaction inconnue). On
     * normalise toujours vers un objet avec un champ `status` exploitable.
     *
     * @return object{status: string, amount?: int, transactionId?: string}
     */
    public function verifyTransaction(string $transactionId): object
    {
        $result = $this->client->verifyTransaction($transactionId);

        if (! is_object($result)) {
            return (object) ['status' => 'FAILED', 'http_code' => $result];
        }

        return $result;
    }
}
