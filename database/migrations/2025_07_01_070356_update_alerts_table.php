<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('industry_alerts', function (Blueprint $table) {
            $table->json('regulation_ids')->nullable()->after('hyperlink_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('industry_alerts', function (Blueprint $table) {
            $table->dropColumn('regulation_ids');
        });
    }
};
