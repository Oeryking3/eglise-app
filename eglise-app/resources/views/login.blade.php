<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Connexion - Église Ambassade des Miracles</title>
<link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>
<div class="device login">

  <div class="top">
    <h1>Bienvenue sur l'appli</h1>
    <p>Le Lorem Ipsum est un texte de remplissage utilisé dans le secteur de l'imprimerie et de la composition. Depuis sley, bibliothécaire à la St Bride Printing.</p>
  </div>

  @if ($errors->any())
    <div style="color:#fff; background:#B5121B; margin:16px 8% 0; padding:12px 16px; border-radius:10px; font-family:Arial, sans-serif; font-size:13px;">
      {{ $errors->first() }}
    </div>
  @endif

  <form method="POST" action="{{ route('login.attempt') }}">
    @csrf
    <div class="field">
      <svg viewBox="0 0 24 24"><path d="M2 4h20v16H2V4zm2 2v.01L12 12l8-5.99V6H4zm16 12V8.24l-8 6-8-6V18h16z"/></svg>
      <input type="email" name="email" placeholder="Email" value="{{ old('email') }}" required>
    </div>
    <div class="field">
      <svg viewBox="0 0 24 24"><path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-7h-1V7a5 5 0 0 0-10 0v3H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zM9 7a3 3 0 0 1 6 0v3H9V7z"/></svg>
      <input type="password" name="password" placeholder="Mot de passe" required>
    </div>

    <div class="forgot">Identifiant oublié ?</div>

    <div class="actions">
      <button type="submit" class="btn-connexion">Connexion</button>
      <div class="signup-text">Vous n'avez pas de compte ?<br>inscrivez-vous</div>
      <button type="button" class="btn-signup" onclick="window.location.href='{{ route('signup') }}';">S'inscrire</button>
    </div>
  </form>

  <div class="privacy">
    <p>This Privacy Policy is meant to help you understand what information we collect, why we collect it, and how you can update, manage, export, and delete your information.</p>
  </div>

</div>
</body>
</html>