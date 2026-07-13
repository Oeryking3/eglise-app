@extends('layouts.admin')

@section('title', 'Paiements')

@section('content')
  <div class="page-title">Paiements</div>

  @forelse ($payments as $payment)
    <div class="list-card">
      <div class="t">{{ $payment->user ? $payment->user->prenom.' '.$payment->user->nom : 'Membre inconnu' }}</div>
      <div class="s">
        {{ $payment->produit }} · {{ number_format($payment->montant, 0, ',', ' ') }} FCFA · {{ strtoupper($payment->methode) }}
        <br>{{ $payment->created_at->format('d/m/Y H:i') }} · Réf: {{ $payment->reference }}
      </div>

      <form method="POST" action="{{ route('admin.payments.updateStatus', $payment) }}" style="margin-top:10px; display:flex; gap:8px; align-items:center;">
        @csrf @method('PUT')
        <select name="statut" onchange="this.form.submit()" style="border:1px solid #f0e2d8; border-radius:10px; padding:6px 10px; font-family:Arial, sans-serif; font-size:12px;">
          <option value="en_attente" {{ $payment->statut === 'en_attente' ? 'selected' : '' }}>En attente</option>
          <option value="reussi" {{ $payment->statut === 'reussi' ? 'selected' : '' }}>Réussi</option>
          <option value="echoue" {{ $payment->statut === 'echoue' ? 'selected' : '' }}>Échoué</option>
        </select>
      </form>

      <div class="row-actions">
        <form method="POST" action="{{ route('admin.payments.destroy', $payment) }}" onsubmit="return confirm('Supprimer ce paiement ?');">
          @csrf @method('DELETE')
          <button type="submit">Supprimer</button>
        </form>
      </div>
    </div>
  @empty
    <p style="font-family:Arial, sans-serif; color:#999; font-size:13px;">Aucun paiement.</p>
  @endforelse

  <div style="margin-top:16px;">{{ $payments->links() }}</div>
@endsection