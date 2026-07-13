<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Confirmation - Église Ambassade des Miracles</title>
<link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>
<div class="device confirm">

  <p>Lorem Ipsum is simply dummy text of the prime</p>

  <img src="{{ asset('img/icon.png') }}" alt="">

</div>

<script>
  setTimeout(function () {
    window.location.href = "{{ route('accueil') }}";
  }, 3000);
</script>

</body>
</html>