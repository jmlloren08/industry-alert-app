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
        Schema::create('alerts_regulations', function (Blueprint $table) {
            $table->id();
            $table->uuid('alert_id');
            $table->uuid('regulation_id');
            $table->timestamps();

            $table->foreign('alert_id')->references('id')->on('industry_alerts')->onDelete('cascade');
            $table->foreign('regulation_id')->references('id')->on('regulations')->onDelete('cascade');

            $table->unique(['alert_id', 'regulation_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alerts_regulations');
    }
};
