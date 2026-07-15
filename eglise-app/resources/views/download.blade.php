<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Téléchargement - Église Ambassade des Miracles</title>
<link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>
<div class="device download">

  <div class="check">✅</div>
  <h1>Paiement confirmé !</h1>
  <p>Merci pour ton paiement. Télécharge ton/tes guide(s) ci-dessous.</p>

  @forelse ($livres as $livre)
    <a href="{{ asset('storage/' . $livre->fichier) }}" class="dl-btn" download target="_blank">
      Télécharger : {{ $livre->titre }}
    </a>
  @empty
    <p>Aucun livre disponible pour le moment.</p>
  @endforelse

</div>
</body>
</html>