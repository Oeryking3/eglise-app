@extends('layouts.admin')

@section('title', 'Direct')

@section('content')
<div class="page-header">
    <div>
        <h1>Direct de l'église</h1>
        <p>Ajoute le lien du direct et active-le quand la diffusion commence.</p>
    </div>
</div>

<div class="card">
    <form method="POST" action="{{ route('admin.direct.update') }}">
        @csrf
        @method('PUT')

        <div class="form-group">
            <label>Lien du direct (YouTube, Facebook...)</label>
            <input type="url" name="url" value="{{ old('url', $liveStream->url) }}" placeholder="https://youtube.com/live/...">
        </div>

        <div class="form-check">
            <input type="checkbox" name="actif" id="actif" value="1" {{ old('actif', $liveStream->actif) ? 'checked' : '' }}>
            <label for="actif">Le direct est actuellement en cours</label>
        </div>

        <button type="submit" class="submit-btn">Enregistrer</button>
    </form>
</div>
@endsection