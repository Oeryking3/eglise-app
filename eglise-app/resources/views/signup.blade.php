<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Inscription - Église Ambassade des Miracles</title>
<link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>
<div class="device signup">

  <div class="top">
    <h1>Bienvenue sur l'appli</h1>
    <p>Le Lorem Ipsum est un texte de remplissage utilisé dans le secteur de l'imprimerie et de la composition. Depuis sley, bibliothécaire à la St Bride Printing.</p>
  </div>

  @if ($errors->any())
    <div style="color:#fff; background:#B5121B; margin:0 8% 16px; padding:12px 16px; border-radius:10px; font-family:Arial, sans-serif; font-size:13px;">
      {{ $errors->first() }}
    </div>
  @endif

  <form method="POST" action="{{ route('signup.attempt') }}">
    @csrf
    <div class="field">
      <svg viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.6-9.8 4.9v2.4h19.6v-2.4c0-3.3-6.5-4.9-9.8-4.9z"/></svg>
      <input type="text" name="nom" placeholder="Nom" value="{{ old('nom') }}" required>
    </div>
    <div class="field">
      <svg viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.6-9.8 4.9v2.4h19.6v-2.4c0-3.3-6.5-4.9-9.8-4.9z"/></svg>
      <input type="text" name="prenom" placeholder="Prenom" value="{{ old('prenom') }}" required>
    </div>
    <div class="field">
      <svg viewBox="0 0 24 24"><path d="M2 4h20v16H2V4zm2 2v.01L12 12l8-5.99V6H4zm16 12V8.24l-8 6-8-6V18h16z"/></svg>
      <input type="email" name="email" placeholder="Email" value="{{ old('email') }}" required>
    </div>
    <div class="field">
      <svg viewBox="0 0 24 24"><path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-7h-1V7a5 5 0 0 0-10 0v3H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zM9 7a3 3 0 0 1 6 0v3H9V7z"/></svg>
      <input type="password" name="password" placeholder="Mot de passe" required>
    </div>
    <div class="field">
      <svg viewBox="0 0 24 24"><path d="M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7zM5 9h14v11H5V9z"/></svg>
      <input type="date" name="date_naissance" placeholder="Date de naissance" value="{{ old('date_naissance') }}">
    </div>
    <div class="field">
      <svg viewBox="0 0 24 24"><path d="M13.5 2l2.8 2.8-1.7 1.7-1.1-1.1v3.1a5 5 0 0 1 3.9 8.6 5 5 0 1 1-6.9-7.2 5 5 0 0 1 1.6-.9V5.4l-1.1 1.1-1.7-1.7L12 2h1.5zM13 10.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>
      <select name="sexe" style="border:none; outline:none; font-family:Arial, sans-serif; font-size:15px; color:#F0602E; width:100%; background:transparent;">
        <option value="">Sexe</option>
        <option value="Homme">Homme</option>
        <option value="Femme">Femme</option>
      </select>
    </div>
    <div class="field">
      <svg viewBox="0 0 24 24"><path d="M12 3l9 8h-2v9h-5v-6H10v6H5v-9H3l9-8z"/></svg>
      <input type="text" name="lieu_residence" placeholder="Lieu de residence" value="{{ old('lieu_residence') }}">
    </div>

    <div class="next-wrap">
      <button type="submit" aria-label="Continuer">
        <svg viewBox="0 0 24 24"><line x1="4" y1="12" x2="20" y2="12"/><polyline points="14 6 20 12 14 18"/></svg>
      </button>
    </div>
  </form>

</div>
</body>
</html>