@extends('layouts.admin')

@section('title', 'Tableau de bord')

@section('content')
  <div class="page-title">Tableau de bord</div>

  <div class="stat-grid">
    <div class="stat-card">
      <div class="n">{{ $stats['membres'] }}</div>
      <div class="l">Membres</div>
    </div>
    <div class="stat-card">
      <div class="n">{{ $stats['evenements'] }}</div>
      <div class="l">Événements</div>
    </div>
    <div class="stat-card">
      <div class="n">{{ $stats['paiements'] }}</div>
      <div class="l">Paiements réussis</div>
    </div>
    <div class="stat-card">
      <div class="n">{{ number_format($stats['revenus'], 0, ',', ' ') }}</div>
      <div class="l">FCFA de revenus</div>
    </div>
  </div>
@endsection