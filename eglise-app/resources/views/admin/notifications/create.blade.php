@extends('layouts.admin')

@section('title', 'Nouvelle notification')

@section('content')
  <div class="page-header">
    <div>
      <h1>Créer une notification</h1>
      <p>Ajoute un message pour les membres.</p>
    </div>
    <a href="{{ route('admin.notifications.index') }}" class="btn btn-outline btn-sm">Retour</a>
  </div>

  <div class="card">
    <form method="POST" action="{{ route('admin.notifications.store') }}">
      @csrf

      <div class="form-group">
        <label class="form-label">Titre</label>
        <input type="text" name="titre" value="{{ old('titre') }}" class="form-control" required>
      </div>

      <div class="form-group">
        <label class="form-label">Message</label>
        <textarea name="message" class="form-control" style="min-height:130px;" required>{{ old('message') }}</textarea>
      </div>

      <button type="submit" class="submit-btn">Publier</button>
    </form>
  </div>
@endsection