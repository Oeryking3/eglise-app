@extends('layouts.admin')

@section('title', 'Modifier notification')

@section('content')
  <div class="page-title">Modifier la notification</div>

  <form method="POST" action="{{ route('admin.notifications.update', $notification) }}">
    @csrf
    @method('PUT')

    <div class="form-group">
      <label>Titre</label>
      <input type="text" name="titre" value="{{ old('titre', $notification->titre) }}" required>
    </div>

    <div class="form-group">
      <label>Message</label>
      <textarea name="message" required>{{ old('message', $notification->message) }}</textarea>
    </div>

    <button type="submit" class="submit-btn">Mettre à jour</button>
  </form>
@endsection