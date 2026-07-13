@extends('layouts.admin')

@section('title', 'Membres')

@section('content')
  <div class="page-title">Membres</div>

  @forelse ($members as $member)
    <div class="list-card">
      <div class="t">{{ $member->prenom }} {{ $member->nom }}
        @if ($member->role === 'admin')
          <span class="badge success" style="margin-left:6px;">Admin</span>
        @endif
      </div>
      <div class="s">
        {{ $member->email }}
        @if ($member->lieu_residence) · {{ $member->lieu_residence }} @endif
      </div>
      <div class="row-actions">
        <a href="{{ route('admin.members.edit', $member) }}">Modifier</a>
        @if ($member->id !== auth()->id())
          <form method="POST" action="{{ route('admin.members.destroy', $member) }}" onsubmit="return confirm('Supprimer ce membre ?');">
            @csrf @method('DELETE')
            <button type="submit">Supprimer</button>
          </form>
        @endif
      </div>
    </div>
  @empty
    <p style="font-family:Arial, sans-serif; color:#999; font-size:13px;">Aucun membre.</p>
  @endforelse

  <div style="margin-top:16px;">{{ $members->links() }}</div>
@endsection