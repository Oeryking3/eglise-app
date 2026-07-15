<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Enregistrement - Église Ambassade des Miracles</title>
<link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>
<div class="device saving">

  <p>Veuillez patienter le temps<br>que nous enregistrons vos informations.</p>

  <img src="{{ asset('img/icon1.png') }}" alt="">

</div>

<script>
  setTimeout(function () {
    window.location.href = "{{ route('confirm') }}";
  }, 1000);
</script>

</body>
</html>