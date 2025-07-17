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
            $table->boolean('is_new')->default(true)->after('model_id');
            $table->boolean('is_reviewed')->default(false)->after('is_new');
            $table->unsignedBigInteger('reviewed_by')->nullable()->after('is_reviewed');
            $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');

            $table->foreign('reviewed_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('industry_alerts', function (Blueprint $table) {
            $table->dropForeign(['reviewed_by']);
            $table->dropColumn('is_new');
            $table->dropColumn('is_reviewed');
            $table->dropColumn('reviewed_by');
            $table->dropColumn('reviewed_at');
        });
    }
};
