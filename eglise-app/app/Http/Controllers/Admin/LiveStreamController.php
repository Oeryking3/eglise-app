<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LiveStream;
use App\Models\LiveStreamLog;
use Illuminate\Http\Request;

class LiveStreamController extends Controller
{
    public function edit()
    {
        $liveStream = LiveStream::current();

        return view('admin.direct.edit', compact('liveStream'));
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
            'url'   => ['nullable', 'url'],
            'actif' => ['sometimes', 'boolean'],
        ]);

        $data['actif'] = $request->boolean('actif');

        $liveStream = LiveStream::current();
        LiveStreamLog::logTransition($liveStream, $data['url'] ?? null, $data['actif']);
        $liveStream->update($data);

        return redirect()->route('admin.direct.edit')->with('success', 'Lien du direct mis à jour.');
    }
}