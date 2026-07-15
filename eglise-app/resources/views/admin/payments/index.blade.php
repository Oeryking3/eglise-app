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

      <span class="badge success" style="margin-top:10px; display:inline-block;">Réussi</span>

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