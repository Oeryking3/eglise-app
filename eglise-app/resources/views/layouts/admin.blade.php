<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>@yield('title', 'Administration') - Église Ambassade des Miracles</title>
<link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>
<div class="device admin">

  <header>
    <h1>Espace Admin</h1>
    <div class="sub">Connecté en tant que {{ auth()->user()->prenom }}</div>
  </header>

  <main class="content">
    @if (session('success'))
      <div class="alert-ok">{{ session('success') }}</div>
    @endif

    @if ($errors->any())
      <div class="alert-error">{{ $errors->first() }}</div>
    @endif

    @yield('content')
  </main>

  <nav class="admin-tabbar">
    <a href="{{ route('admin.dashboard') }}" class="{{ request()->routeIs('admin.dashboard') ? 'active' : '' }}">
      <span class="ic">🏠</span>Accueil
    </a>
    <a href="{{ route('admin.events.index') }}" class="{{ request()->routeIs('admin.events.*') ? 'active' : '' }}">
      <span class="ic">📅</span>Évén.
    </a>
    <a href="{{ route('admin.notifications.index') }}" class="{{ request()->routeIs('admin.notifications.*') ? 'active' : '' }}">
      <span class="ic">🔔</span>Notifs
    </a>
    <a href="{{ route('admin.payments.index') }}" class="{{ request()->routeIs('admin.payments.*') ? 'active' : '' }}">
      <span class="ic">💳</span>Paiem.
    </a>
    <a href="{{ route('admin.members.index') }}" class="{{ request()->routeIs('admin.members.*') ? 'active' : '' }}">
      <span class="ic">👥</span>Membres
    </a>
    <a href="{{ route('admin.livres.index') }}" class="{{ request()->routeIs('admin.livres.*') ? 'active' : '' }}">
      <span class="ic">📚</span>Livres
    </a>
    <a href="{{ route('admin.direct.edit') }}" class="{{ request()->routeIs('admin.direct.*') ? 'active' : '' }}">
      <span class="ic">📡</span>Direct
    </a>
    <a href="{{ route('admin.avantages.index') }}" class="{{ request()->routeIs('admin.avantages.*') ? 'active' : '' }}">
      <span class="ic">🎫</span>Avantages
    </a>
    <a href="#" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
      <span class="ic">🚪</span>Sortir
    </a>
  </nav>
  <form id="logout-form" method="POST" action="{{ route('logout') }}" style="display:none;">
    @csrf
  </form>

</div>
</body>
</html>