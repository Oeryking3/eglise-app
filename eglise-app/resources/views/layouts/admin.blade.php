<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>@yield('title', 'Administration') - Église Ambassade des Miracles</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUa6ljX6H6q3KDjY9Y2w0FcvA3F6v7d4f8HulBlA57Gk5Q3JyJI8Z4Q5FtwK" crossorigin="anonymous">
<link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body class="bg-light">
<div class="container-fluid min-vh-100">
  <div class="row">
    <aside class="col-md-3 col-xl-2 bg-white border-end p-4">
      <div class="mb-4">
        <h2 class="h5">Espace Admin</h2>
        <p class="text-muted mb-0">Connecté en tant que <strong>{{ auth()->user()->prenom }}</strong></p>
      </div>

      <nav class="nav nav-pills flex-column gap-2">
        <a class="nav-link d-flex align-items-center justify-content-between {{ request()->routeIs('admin.dashboard') ? 'active' : '' }}" href="{{ route('admin.dashboard') }}">
          <span>Accueil</span>
          <span class="badge bg-light text-dark">🏠</span>
        </a>
        <a class="nav-link d-flex align-items-center justify-content-between {{ request()->routeIs('admin.events.*') ? 'active' : '' }}" href="{{ route('admin.events.index') }}">
          <span>Événements</span>
          <span class="badge bg-light text-dark">📅</span>
        </a>
        <a class="nav-link d-flex align-items-center justify-content-between {{ request()->routeIs('admin.notifications.*') ? 'active' : '' }}" href="{{ route('admin.notifications.index') }}">
          <span>Notifications</span>
          <span class="badge bg-light text-dark">🔔</span>
        </a>
        <a class="nav-link d-flex align-items-center justify-content-between {{ request()->routeIs('admin.payments.*') ? 'active' : '' }}" href="{{ route('admin.payments.index') }}">
          <span>Paiements</span>
          <span class="badge bg-light text-dark">💳</span>
        </a>
        <a class="nav-link d-flex align-items-center justify-content-between {{ request()->routeIs('admin.members.*') ? 'active' : '' }}" href="{{ route('admin.members.index') }}">
          <span>Membres</span>
          <span class="badge bg-light text-dark">👥</span>
        </a>
        <a class="nav-link text-danger" href="#" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
          <span>Déconnexion</span>
          <span class="badge bg-danger text-white">🚪</span>
        </a>
      </nav>

      <form id="logout-form" method="POST" action="{{ route('logout') }}" class="d-none">
        @csrf
      </form>
    </aside>

    <main class="col-md-9 col-xl-10 py-4 px-4">
      @if (session('success'))
        <div class="alert alert-success alert-dismissible fade show" role="alert">
          {{ session('success') }}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      @endif

      @yield('content')
    </main>
  </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-HoA0x4otLHS4F3zyiMxL4jDx7FAGx8jHoh1J1tJyQpOIz3URPwU7f3R52ZLTO5F4" crossorigin="anonymous"></script>
</body>
</html>
