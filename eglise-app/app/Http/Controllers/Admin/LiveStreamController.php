<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LiveStream;
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
        $data = $request->validate([
            'url'   => ['nullable', 'url'],
            'actif' => ['sometimes', 'boolean'],
        ]);

        $data['actif'] = $request->boolean('actif');

        $liveStream = LiveStream::current();
        $liveStream->update($data);

        return redirect()->route('admin.direct.edit')->with('success', 'Lien du direct mis à jour.');
    }
}