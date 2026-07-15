@extends('layouts.admin')

@section('title', 'Créer un événement')

@section('content')
<div class="page-header">
    <div>
        <h1>Ajouter un événement</h1>
        <p>Crée un événement et choisis s'il doit être mis en avant.</p>
    </div>
    <a href="{{ route('admin.events.index') }}" class="btn btn-outline">Retour</a>
</div>

@if ($errors->has('important'))
    <div class="alert-error" style="margin-bottom:16px;">{{ $errors->first('important') }}</div>
@endif

<div class="card">
    <form method="POST" action="{{ route('admin.events.store') }}" enctype="multipart/form-data">
        @csrf

        <div class="form-group">
            <label>Titre</label>
            <input type="text" name="titre" value="{{ old('titre') }}" required>
        </div>

        <div class="form-group">
            <label>Description</label>
            <textarea name="description">{{ old('description') }}</textarea>
        </div>

        <div class="form-group">
            <label>Image</label>
            <input type="file" name="image" accept="image/*">
        </div>

        <div class="form-row">
            <div class="form-group">
               <label>Date de l'événement</label>
               <input type="date" name="date_evenement" value="{{ old('date_evenement') }}" min="{{ now()->format('Y-m-d') }}" required>
            </div>
            <div class="form-group">
                <label>Heure de début</label>
                <input type="time" name="heure_debut" value="{{ old('heure_debut') }}">
            </div>
            <div class="form-group">
                <label>Heure de fin</label>
                <input type="time" name="heure_fin" value="{{ old('heure_fin') }}">
            </div>
        </div>

        <div class="form-check">
            <input type="checkbox" name="important" id="important" value="1" {{ old('important') ? 'checked' : '' }}>
            <label for="important">Marquer comme événement à venir (3 maximum)</label>
        </div>

        <button type="submit" class="submit-btn">Publier l'événement</button>
    </form>
</div>
@endsection