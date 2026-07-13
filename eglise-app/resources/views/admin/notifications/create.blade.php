@extends('layouts.admin')

@section('title', 'Nouvelle notification')

@section('content')
  <div class="d-flex justify-content-between align-items-center mb-4">
    <div>
      <h1 class="h4 mb-1">Créer une notification</h1>
      <p class="text-muted">Ajoute un message pour les membres.</p>
    </div>
    <a href="{{ route('admin.notifications.index') }}" class="btn btn-outline-secondary">Retour</a>
  </div>

  <div class="card shadow-sm">
    <div class="card-body">
      <form method="POST" action="{{ route('admin.notifications.store') }}">
        @csrf

        <div class="mb-3">
          <label class="form-label">Titre</label>
          <input type="text" name="titre" value="{{ old('titre') }}" class="form-control" required>
        </div>

        <div class="mb-3">
          <label class="form-label">Message</label>
          <textarea name="message" class="form-control" rows="5" required>{{ old('message') }}</textarea>
        </div>

        <button type="submit" class="btn btn-primary">Publier</button>
      </form>
    </div>
  </div>
@endsection
