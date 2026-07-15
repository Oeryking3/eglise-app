@extends('layouts.admin')

@section('title', 'Ajouter un livre PDF')

@section('content')
<div class="page-header">
    <div>
        <h1>Ajouter un livre PDF</h1>
        <p>Le fichier sera disponible au téléchargement après paiement.</p>
    </div>
    <a href="{{ route('admin.livres.index') }}" class="btn btn-outline">Retour</a>
</div>

<div class="card">
    <form method="POST" action="{{ route('admin.livres.store') }}" enctype="multipart/form-data">
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
            <label>Fichier PDF</label>
            <input type="file" name="fichier" accept="application/pdf" required>
        </div>

        <button type="submit" class="submit-btn">Ajouter le livre</button>
    </form>
</div>
@endsection