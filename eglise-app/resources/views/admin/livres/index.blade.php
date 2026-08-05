@extends('layouts.admin')

@section('title', 'Livres PDF')

@section('content')
<div class="page-header">
    <div>
        <h1>Livres PDF</h1>
        <p>Gère les guides PDF disponibles après paiement.</p>
    </div>
    <a href="{{ route('admin.livres.create') }}" class="btn btn-primary">+ Ajouter</a>
</div>

<div class="events-grid">
    @forelse ($livres as $livre)
        <div class="event-card">
            <div class="event-top">
                <h2>{{ $livre->titre }}</h2>
            </div>
            @if ($livre->description)
                <p>{{ $livre->description }}</p>
            @endif
            <p style="color:#F0602E; font-weight:700;">{{ number_format($livre->prix, 0, ',', ' ') }} FCFA</p>
            <div class="actions">
                <a href="{{ asset('storage/' . $livre->fichier) }}" target="_blank" style="color:#F0602E; font-family:Arial, sans-serif; font-size:12px; font-weight:700; text-decoration:none;">
                    Voir le PDF
                </a>
                <form action="{{ route('admin.livres.destroy', $livre) }}" method="POST" onsubmit="return confirm('Supprimer ce livre ?');">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="btn btn-danger btn-sm">Supprimer</button>
                </form>
            </div>
        </div>
    @empty
        <div class="empty-state">Aucun livre PDF pour le moment.</div>
    @endforelse
</div>
@endsection