<?php

namespace App\Http\Controllers;

use App\Models\Livre;
use Illuminate\Support\Facades\Storage;

class LivreDownloadController extends Controller
{
    /**
     * Force le téléchargement du PDF (Content-Disposition: attachment) au
     * lieu de le laisser s'ouvrir dans le navigateur. Accessible uniquement
     * via un lien signé généré pour un membre qui a acheté ce livre (voir
     * Api\LivreController::index) — pas d'accès direct par id.
     */
    public function show(Livre $livre)
    {
        abort_unless($livre->fichier && Storage::disk('public')->exists($livre->fichier), 404);

        return Storage::disk('public')->download($livre->fichier, $livre->titre . '.pdf');
    }
}
