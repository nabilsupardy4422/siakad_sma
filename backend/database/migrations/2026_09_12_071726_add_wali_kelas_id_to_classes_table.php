<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('classes', function (Blueprint $table) {
            $table->foreignId('wali_kelas_id')
                ->nullable()
                ->after('level')
                ->constrained('teachers')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('classes', function (Blueprint $table) {
            $table->dropForeign(['wali_kelas_id']);
            $table->dropColumn('wali_kelas_id');
        });
    }
};