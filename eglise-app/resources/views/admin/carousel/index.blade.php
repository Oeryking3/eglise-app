@extends('layouts.admin')

@section('title', 'Carrousel publicitaire')

@section('content')
  <div class="page-header">
    <div>
      <h1>Carrousel publicitaire</h1>
      <p>Ajoute plusieurs affiches qui défileront sur l’accueil membre.</p>
    </div>
    <a href="{{ route('admin.carousel.create') }}" class="add-btn">+ Ajouter une image</a>
  </div>

  @forelse ($slides as $slide)
    <div class="list-card">
      <img src="{{ asset('storage/' . $slide->image) }}" alt="Publicité" style="width:100%;height:150px;object-fit:cover;border-radius:12px;display:block;margin-bottom:12px;">
      <div class="row-actions">
        <span class="sub">Ordre: {{ $slide->ordre }}</span>
        <form method="POST" action="{{ route('admin.carousel.destroy', $slide) }}" onsubmit="return confirm('Supprimer cette image du carrousel ?');">
          @csrf @method('DELETE')
          <button type="submit">Supprimer</button>
        </form>
      </div>
    </div>
  @empty
    <div class="empty-state">Aucune image pour le moment.</div>
  @endforelse
@endsection
