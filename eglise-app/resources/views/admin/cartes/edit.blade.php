@extends('layouts.admin')

@section('title', 'Carte de membre')

@section('content')
<div class="page-header">
    <div>
        <h1>Carte de {{ $member->prenom }} {{ $member->nom }}</h1>
        <p>Renseigne les informations de la carte.</p>
    </div>
    <a href="{{ route('admin.cartes.index') }}" class="btn btn-outline">Retour</a>
</div>

<div class="card">
    <form method="POST" action="{{ route('admin.cartes.update', $member) }}" enctype="multipart/form-data">
        @csrf
        @method('PUT')

        <div class="form-group">
            <label>Photo</label>
            @if ($member->carte_photo)
                <div class="img-preview">
                    <img src="{{ $member->carte_photo_url }}" alt="Photo">
                </div>
            @endif
            <input type="file" name="carte_photo" accept="image/*">
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>Date de naissance</label>
                <input type="date" name="date_naissance" value="{{ old('date_naissance', $member->date_naissance?->format('Y-m-d')) }}">
            </div>
            <div class="form-group">
                <label>Sexe</label>
                <select name="sexe">
                    <option value="">—</option>
                    <option value="M" {{ old('sexe', $member->sexe) === 'M' ? 'selected' : '' }}>M</option>
                    <option value="F" {{ old('sexe', $member->sexe) === 'F' ? 'selected' : '' }}>F</option>
                </select>
            </div>
            <div class="form-group">
                <label>Groupe sanguin</label>
                <input type="text" name="groupe_sanguin" value="{{ old('groupe_sanguin', $member->groupe_sanguin) }}" placeholder="B+">
            </div>
        </div>

        <div class="form-group">
            <label>Date d'expiration de la carte</label>
            <input type="date" name="carte_expiration" value="{{ old('carte_expiration', $member->carte_expiration?->format('Y-m-d')) }}">
        </div>

        <div class="form-check">
            <input type="checkbox" name="carte_membre" id="carte_membre" value="1" {{ old('carte_membre', $member->carte_membre) ? 'checked' : '' }}>
            <label for="carte_membre">Carte active</label>
        </div>

        <button type="submit" class="submit-btn">Enregistrer la carte</button>
    </form>
</div>
@endsection