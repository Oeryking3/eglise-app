<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\LiveStreamResource;
use App\Models\LiveStream;
use Illuminate\Http\Request;

class LiveStreamController extends Controller
{
    public function edit()
    {
        return new LiveStreamResource(LiveStream::current());
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'url' => ['nullable', 'url'],
            'actif' => ['sometimes', 'boolean'],
        ]);

        $data['actif'] = $request->boolean('actif');

        $liveStream = LiveStream::current();
        $liveStream->update($data);

        return response()->json(['live_stream' => new LiveStreamResource($liveStream)]);
    }
}
