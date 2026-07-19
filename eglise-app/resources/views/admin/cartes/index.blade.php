@extends('layouts.admin')

@section('title', 'Cartes de membre')

@section('content')
<div class="page-header">
    <div>
        <h1>Cartes de membre</h1>
        <p>Gère les cartes de tous les membres.</p>
    </div>
</div>

<div class="events-grid">
    @forelse ($members as $member)
        <div class="event-card">
            <div class="event-top">
                <div>
                    <h2>{{ $member->prenom }} {{ $member->nom }}</h2>
                    <div class="meta">{{ $member->email }}</div>
                </div>
                @if ($member->carte_est_valide)
                    <span class="badge success">Active</span>
                @elseif ($member->carte_membre)
                    <span class="badge failed">Expirée</span>
                @else
                    <span class="badge pending">Aucune carte</span>
                @endif
            </div>

            <div class="actions">
                <a href="{{ route('admin.cartes.edit', $member) }}" class="btn btn-outline">Gérer la carte</a>
                @if ($member->carte_membre)
                    <form method="POST" action="{{ route('admin.cartes.destroy', $member) }}" onsubmit="return confirm('Supprimer la carte de ce membre ?');">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn btn-danger">Supprimer la carte</button>
                    </form>
                @endif
            </div>
        </div>
    @empty
        <div class="empty-state">Aucun membre pour le moment.</div>
    @endforelse
</div>

<div class="pagination-wrap">{{ $members->links() }}</div>
@endsection