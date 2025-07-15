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
            $table->foreignUuid('source_id')->after('number')->references('id')->on('sources');
            $table->foreignUuid('organization_id')->after('regulation_id')->references('id')->on('organizations');
            $table->foreignUuid('site_id')->after('organization_id')->references('id')->on('sites');
            $table->foreignUuid('plant_type_id')->after('site_id')->references('id')->on('plant_types');
            $table->foreignUuid('plant_make_id')->after('plant_type_id')->references('id')->on('plant_makes');
            $table->foreignUuid('plant_model_id')->after('plant_make_id')->references('id')->on('plant_models');
        });

        Schema::table('plant_makes', function (Blueprint $table) {
            $table->foreignUuid('type_id')->after('id')->references('id')->on('plant_types');
        });

        Schema::table('plant_models', function (Blueprint $table) {
            $table->foreignUuid('make_id')->after('id')->references('id')->on('plant_makes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('industry_alerts', function (Blueprint $table) {
            $table->dropForeign(['source_id']);
            $table->dropForeign(['organization_id']);
            $table->dropForeign(['site_id']);
            $table->dropForeign(['plant_type_id']);
            $table->dropForeign(['make_id']);
            $table->dropForeign(['model_id']);
        });
    }
};
