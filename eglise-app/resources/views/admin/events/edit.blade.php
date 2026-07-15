@extends('layouts.admin')

@section('title', 'Modifier un événement')

@section('content')
<div class="page-header">
    <div>
        <h1>Modifier l'événement</h1>
        <p>Mets à jour les informations de cet événement.</p>
    </div>
    <a href="{{ route('admin.events.index') }}" class="btn btn-outline">Retour</a>
</div>

@if ($errors->has('important'))
    <div class="alert-error" style="margin-bottom:16px;">{{ $errors->first('important') }}</div>
@endif

<div class="card">
    <form method="POST" action="{{ route('admin.events.update', $event) }}" enctype="multipart/form-data">
        @csrf
        @method('PUT')

        <div class="form-group">
            <label>Titre</label>
            <input type="text" name="titre" value="{{ old('titre', $event->titre) }}" required>
        </div>

        <div class="form-group">
            <label>Description</label>
            <textarea name="description">{{ old('description', $event->description) }}</textarea>
        </div>

        <div class="form-group">
            <label>Image</label>
            @if ($event->image)
                <div class="img-preview">
                    <img src="{{ $event->image_url }}" alt="{{ $event->titre }}">
                </div>
            @endif
            <input type="file" name="image" accept="image/*">
        </div>

        <div class="form-row">
            <<div class="form-group">
                <label>Date de l'événement</label>
                <input type="date" name="date_evenement" value="{{ old('date_evenement', $event->date_evenement->format('Y-m-d')) }}" min="{{ now()->format('Y-m-d') }}" required>
            </div>
            <div class="form-group">
                <label>Heure de début</label>
                <input type="time" name="heure_debut" value="{{ old('heure_debut', $event->heure_debut) }}">
            </div>
            <div class="form-group">
                <label>Heure de fin</label>
                <input type="time" name="heure_fin" value="{{ old('heure_fin', $event->heure_fin) }}">
            </div>
        </div>

        <div class="form-check">
            <input type="checkbox" name="important" id="important" value="1" {{ old('important', $event->important) ? 'checked' : '' }}>
            <label for="important">Marquer comme événement à venir (3 maximum)</label>
        </div>

        <button type="submit" class="submit-btn">Enregistrer les modifications</button>
    </form>
</div>
@endsection