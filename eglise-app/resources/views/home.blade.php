<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bienvenue - Église Ambassade des Miracles</title>
<link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>
<div class="device home">

  <div class="brand">
    <img src="{{ asset('img/logo.png') }}" alt="Logo Église Ambassade des Miracles">
  </div>

  <div class="welcome">
    <h1>Bienvenue sur l'appli</h1>
    <p>Le Lorem Ipsum est un texte de remplissage utilisé dans le secteur de l'imprimerie et de la composition. Depuis 1966, il est devenu la norme pour les textes factices, lorsque des graphistes de Letraset et James Mosley, bibliothécaire à la St Bride Printing.</p>
  </div>

  <div class="cta-wrap">
    <button type="button" onclick="window.location.href='{{ route('login') }}'">Continuer</button>
  </div>

</div>
</body>
</html>