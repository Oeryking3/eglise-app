<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Paiement - Église Ambassade des Miracles</title>
<link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>
<div class="device payment">

  <div class="top">
    <h1>Comment créer un miracle</h1>
    <p>Débloque le guide complet en PDF pour marcher dans la foi et voir des miracles se manifester.</p>
    <div class="price">2 000 FCFA</div>
  </div>

  <div class="methods">
    <div class="methods-label">Choisir un mode de paiement</div>
    <div class="method-grid">
      <div class="method-card">
        <input type="radio" name="method" id="m-wave" value="wave" checked>
        <label for="m-wave"><span class="dot wave">W</span>Wave</label>
      </div>
      <div class="method-card">
        <input type="radio" name="method" id="m-orange" value="orange">
        <label for="m-orange"><span class="dot orange">OM</span>Orange Money</label>
      </div>
      <div class="method-card">
        <input type="radio" name="method" id="m-mtn" value="mtn">
        <label for="m-mtn"><span class="dot mtn">MTN</span>MTN Money</label>
      </div>
      <div class="method-card">
        <input type="radio" name="method" id="m-moov" value="moov">
        <label for="m-moov"><span class="dot moov">M</span>Moov Money</label>
      </div>
      <div class="method-card">
        <input type="radio" name="method" id="m-card" value="card">
        <label for="m-card"><span class="dot card">💳</span>Carte bancaire</label>
      </div>
    </div>
  </div>

  <form method="POST" action="{{ route('payment.process') }}">
    @csrf
    <input type="hidden" name="methode" id="methode-input" value="wave">

    <div class="mobile-fields active" id="mobile-fields">
      <div class="field">
        <input type="tel" name="telephone" placeholder="Numéro de téléphone (ex: 07 00 00 00 00)" required>
      </div>
    </div>

    <div class="card-fields" id="card-fields">
      <div class="field">
        <input type="text" placeholder="Nom sur la carte">
      </div>
      <div class="field">
        <input type="text" placeholder="Numéro de carte" inputmode="numeric">
      </div>
      <div class="row2">
        <div class="field">
          <input type="text" placeholder="MM/AA">
        </div>
        <div class="field">
          <input type="text" placeholder="CVV" inputmode="numeric">
        </div>
      </div>
    </div>

    <button type="submit" class="pay-btn">Payer 2 000 FCFA</button>
  </form>

</div>

<script>
  const radios = document.querySelectorAll('input[name="method"]');
  const mobileFields = document.getElementById('mobile-fields');
  const cardFields = document.getElementById('card-fields');
  const methodeInput = document.getElementById('methode-input');
  const phoneInput = mobileFields.querySelector('input');

  function updateFields(){
    const selected = document.querySelector('input[name="method"]:checked').value;
    methodeInput.value = selected;
    if (selected === 'card') {
      mobileFields.classList.remove('active');
      cardFields.classList.add('active');
      phoneInput.required = false;
    } else {
      cardFields.classList.remove('active');
      mobileFields.classList.add('active');
      phoneInput.required = true;
    }
  }

  radios.forEach(r => r.addEventListener('change', updateFields));
  updateFields();
</script>

</body>
</html>