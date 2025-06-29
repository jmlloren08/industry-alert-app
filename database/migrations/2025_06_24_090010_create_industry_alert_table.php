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
        Schema::create('industry_alerts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('number')->unique();
            // foreign key
            // $table->uuid('source_id')->nullable();

            $table->timestamp('incident_date');
            $table->text('description');
            $table->text('hyperlink_text')->nullable();
            $table->text('hyperlink_url')->nullable();
            // foreign keys
            // $table->uuid('reg_id')->nullable();
            // $table->uuid('organization_id')->nullable();
            // $table->uuid('site_id')->nullable();
            // $table->uuid('plant_type_id')->nullable();
            // $table->uuid('make_id')->nullable();
            // $table->uuid('model_id')->nullable();

            $table->string('hazards')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('industry_alerts');
    }
};
