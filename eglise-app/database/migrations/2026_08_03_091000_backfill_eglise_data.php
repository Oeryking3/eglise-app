<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $egliseId = DB::table('eglises')->insertGetId([
            'nom' => 'Ambassade des Miracles',
            'code' => 'AM',
            'statut' => 'active',
            'contact_nom' => 'Sidibe Sory',
            'contact_email' => 'sory@gmail.com',
            'approuvee_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        foreach (['users', 'events', 'payments', 'agenda_items', 'livres', 'card_benefits', 'church_notifications', 'live_streams'] as $table) {
            DB::table($table)->update(['eglise_id' => $egliseId]);
        }

        DB::table('users')->where('role', 'admin')->update(['role' => 'admin_eglise']);

        $maxSeq = DB::table('users')->whereNotNull('member_id')
            ->max(DB::raw('CAST(SUBSTRING(member_id, 4) AS UNSIGNED)'));

        DB::table('eglises')->where('id', $egliseId)->update(['membres_sequence' => (int) $maxSeq]);
    }

    public function down(): void
    {
        DB::table('users')->where('role', 'admin_eglise')->update(['role' => 'admin']);

        foreach (['users', 'events', 'payments', 'agenda_items', 'livres', 'card_benefits', 'church_notifications', 'live_streams'] as $table) {
            DB::table($table)->update(['eglise_id' => null]);
        }

        DB::table('eglises')->where('code', 'AM')->delete();
    }
};
