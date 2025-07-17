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
            // Add new columns
            $table->uuid('source_id')->nullable()->after('number');
            $table->uuid('organization_id')->nullable()->after('hyperlink_url');
            $table->uuid('site_id')->nullable()->after('organization_id');
            $table->uuid('type_id')->nullable()->after('site_id');
            $table->uuid('make_id')->nullable()->after('type_id');
            $table->uuid('model_id')->nullable()->after('make_id');

            // Add foreign key constraints
            $table->foreign('source_id')->references('id')->on('sources')->onDelete('set null');
            $table->foreign('organization_id')->references('id')->on('organizations')->onDelete('set null');
            $table->foreign('site_id')->references('id')->on('sites')->onDelete('set null');
            $table->foreign('type_id')->references('id')->on('plant_types')->onDelete('set null');
            $table->foreign('make_id')->references('id')->on('plant_makes')->onDelete('set null');
            $table->foreign('model_id')->references('id')->on('plant_models')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('industry_alerts', function (Blueprint $table) {
            // Drop foreign key constraints
            $table->dropForeign(['source_id']);
            $table->dropForeign(['organization_id']);
            $table->dropForeign(['site_id']);
            $table->dropForeign(['type_id']);
            $table->dropForeign(['make_id']);
            $table->dropForeign(['model_id']);

            // Drop columns
            $table->dropColumn(['source_id', 'organization_id', 'site_id', 'type_id', 'make_id', 'model_id']);
        });
    }
};
