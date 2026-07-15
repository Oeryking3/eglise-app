@extends('layouts.admin')

@section('title', 'Ajouter un avantage')

@section('content')
<div class="page-header">
    <div>
        <h1>Ajouter un avantage</h1>
        <p>Cet avantage sera visible par tous les membres avec la carte.</p>
    </div>
    <a href="{{ route('admin.avantages.index') }}" class="btn btn-outline">Retour</a>
</div>

<div class="card">
    <form method="POST" action="{{ route('admin.avantages.store') }}">
        @csrf

        <div class="form-group">
            <label>Titre</label>
            <input type="text" name="titre" value="{{ old('titre') }}" required>
        </div>

        <div class="form-group">
            <label>Description</label>
            <textarea name="description">{{ old('description') }}</textarea>
        </div>

        <button type="submit" class="submit-btn">Ajouter l'avantage</button>
    </form>
</div>
@endsection