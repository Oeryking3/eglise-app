@extends('layouts.admin')

@section('title', 'Avantages carte')

@section('content')
<div class="page-header">
    <div>
        <h1>Avantages de la carte</h1>
        <p>Gère les avantages affichés aux membres possédant la carte.</p>
    </div>
    <a href="{{ route('admin.avantages.create') }}" class="btn btn-primary">+ Ajouter</a>
</div>

<div class="events-grid">
    @forelse ($benefits as $benefit)
        <div class="event-card">
            <div class="event-top">
                <h2>{{ $benefit->titre }}</h2>
            </div>
            @if ($benefit->description)
                <p>{{ $benefit->description }}</p>
            @endif
            <div class="actions">
                <form action="{{ route('admin.avantages.destroy', $benefit) }}" method="POST" onsubmit="return confirm('Supprimer cet avantage ?');">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="btn btn-danger btn-sm">Supprimer</button>
                </form>
            </div>
        </div>
    @empty
        <div class="empty-state">Aucun avantage pour le moment.</div>
    @endforelse
</div>
@endsection