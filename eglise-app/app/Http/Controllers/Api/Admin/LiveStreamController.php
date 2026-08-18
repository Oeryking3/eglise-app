<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\LiveStreamLogResource;
use App\Http\Resources\LiveStreamResource;
use App\Models\LiveStream;
use App\Models\LiveStreamLog;
use Illuminate\Http\Request;

class LiveStreamController extends Controller
{
    public function edit()
    {
        LiveStreamLog::pruneOld();

        return response()->json([
            'live_stream' => new LiveStreamResource(LiveStream::current()),
            'historique' => LiveStreamLogResource::collection(
                LiveStreamLog::latest('started_at')->take(20)->get()
            ),
        ]);
    }

    public function update(Request $request)
    {
        // Le placeholder ("youtube.com/live/...") n'affiche pas de schéma,
        // donc les admins en tapent souvent sans "https://" — on le rajoute
        // avant validation plutôt que de rejeter un lien par ailleurs valide.
        if ($request->filled('url') && ! preg_match('#^https?://#i', $request->input('url'))) {
            $request->merge(['url' => 'https://' . $request->input('url')]);
        }

        $data = $request->validate([
            'url' => ['nullable', 'url'],
            'actif' => ['sometimes', 'boolean'],
        ]);

        $data['actif'] = $request->boolean('actif');

        $liveStream = LiveStream::current();
        LiveStreamLog::logTransition($liveStream, $data['url'] ?? null, $data['actif']);
        $liveStream->update($data);

        return response()->json(['live_stream' => new LiveStreamResource($liveStream)]);
    }
}
