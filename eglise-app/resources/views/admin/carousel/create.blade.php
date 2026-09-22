@extends('layouts.admin')

@section('title', 'Ajouter une image')

@section('content')
  <div class="page-header">
    <div>
      <h1>Ajouter une image</h1>
      <p>Cette image apparaîtra dans le carrousel de l’accueil membre.</p>
    </div>
    <a href="{{ route('admin.carousel.index') }}" class="btn btn-outline btn-sm">Retour</a>
  </div>

  <div class="card">
    <form method="POST" action="{{ route('admin.carousel.store') }}" enctype="multipart/form-data">
      @csrf

      <div class="form-group">
        <label class="form-label">Image</label>
        <input type="file" name="image" class="form-control" accept="image/*" required>
      </div>

      <div class="form-group">
        <label class="form-label">Ordre d’affichage</label>
        <input type="number" name="ordre" value="0" min="0" class="form-control">
      </div>

      <div class="form-group checkbox-row">
        <label>
          <input type="checkbox" name="actif" value="1" checked>
          Afficher cette image
        </label>
      </div>

      <button type="submit" class="submit-btn">Enregistrer</button>
    </form>
  </div>
@endsection
