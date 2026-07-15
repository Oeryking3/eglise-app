@extends('layouts.admin')

@section('title', 'Modifier membre')

@section('content')
  <div class="page-title">Modifier le membre</div>

  <div class="card">
    <form method="POST" action="{{ route('admin.members.update', $member) }}">
      @csrf
      @method('PUT')

      <div class="form-group">
        <label>Email</label>
        <input type="email" value="{{ $member->email }}" disabled>
      </div>

      <div class="form-group">
        <label>Nom</label>
        <input type="text" name="nom" value="{{ old('nom', $member->nom) }}" required>
      </div>

      <div class="form-group">
        <label>Prénom</label>
        <input type="text" name="prenom" value="{{ old('prenom', $member->prenom) }}" required>
      </div>

      <div class="form-group">
        <label>Lieu de résidence</label>
        <input type="text" name="lieu_residence" value="{{ old('lieu_residence', $member->lieu_residence) }}">
      </div>

      <div class="form-group">
        <label>Rôle</label>
        <select name="role">
          <option value="membre" {{ old('role', $member->role) === 'membre' ? 'selected' : '' }}>Utilisateur</option>
          <option value="admin" {{ old('role', $member->role) === 'admin' ? 'selected' : '' }}>Admin</option>
        </select>
      </div>

      <div class="form-check">
        <input type="checkbox" name="carte_membre" id="carte_membre" value="1" {{ old('carte_membre', $member->carte_membre) ? 'checked' : '' }}>
        <label for="carte_membre">Carte de membre active</label>
      </div>

      <button type="submit" class="submit-btn">Mettre à jour</button>
    </form>
  </div>
@endsection