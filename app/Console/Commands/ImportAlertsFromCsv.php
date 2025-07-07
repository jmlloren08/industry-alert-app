<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use League\Csv\Reader;
use Illuminate\Support\Str;

class ImportAlertsFromCsv extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:alerts-from-csv';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import alerts from a CSV file into the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {

        $path = storage_path('app/alerts.csv');

        if (!file_exists($path)) {
            $this->error('CSV file not found at ' . $path);
            return;
        }

        $csv = Reader::createFromPath($path, 'r');
        $csv->setHeaderOffset(0);

        foreach ($csv as $record) {

            DB::beginTransaction();

            try {
                // Skip if alert number already exists
                $exists = DB::table('industry_alerts')->where('number', $record['number'])->exists();
                if ($exists) {
                    $this->warn('⚠️ Alert number ' . $record['number'] . ' already exists. Skipping.');
                    DB::rollBack();
                    continue;
                }

                $alertId = (string) Str::uuid();
                // Fetch FK IDs // Lookups
                $sourceId = DB::table('sources')->where('name', $record['source_id'])->value('id');
                $organizationId = DB::table('organizations')->where('name', $record['organization_id'])->value('id');
                $siteId = DB::table('sites')->where('name', $record['site_id'])->value('id');
                $plantTypeId = DB::table('plant_types')->where('name', $record['type_id'])->value('id');
                $plantMakeId = DB::table('plant_makes')->where('name', $record['make_id'])->where('type_id', $plantTypeId)->value('id');
                $plantModelId = DB::table('plant_models')->where('name', $record['model_id'])->where('make_id', $plantMakeId)->value('id');
                // Validate required fields
                if (!$sourceId || !$organizationId || !$siteId) {
                    $this->warn('⚠️ Missing required foreign key for alert number ' . $record['number'] . '. Skipping.');
                    DB::rollBack();
                    continue;
                }

                // Insert into alerts table

                $description  = $record['description'];
                $description = str_replace(["\xA0", "\xC2\xA0"], ' ', $description);
                $description = preg_replace('/[\s\p{Zs}\x{00a0}]+$/u', '', $description);
                $description = trim($description);
                
                if (empty($description)) {
                    $this->warn('⚠️ Description is empty for alert number ' . $record['number'] . '. Skipping.');
                    DB::rollBack();
                    continue;
                }

                DB::table('industry_alerts')->insert([
                    'id' => $alertId,
                    'number' => $record['number'],
                    'source_id' => $sourceId,
                    'incident_date' => $record['incident_date'],
                    'description' => $description,
                    'hyperlink_url' => $record['hyperlink_url'],
                    'organization_id' => $organizationId,
                    'site_id' => $siteId,
                    'type_id' => $plantTypeId,
                    'make_id' => $plantMakeId,
                    'model_id' => $plantModelId,
                    'hazards' => $record['hazards'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Handle regulations (pivot table)
                $regulations = array_map('trim', explode(',', $record['regulation_id']));

                foreach ($regulations as $regCode) {
                    $regulationId = DB::table('regulations')->where('section', $regCode)->value('id');
                    if ($regulationId) {
                        DB::table('alerts_regulations')->insert([
                            'alert_id' => $alertId,
                            'regulation_id' => $regulationId,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
                DB::commit();
                $this->info('✅ CSV import successful!');
            } catch (\Throwable $e) {
                DB::rollback();
                $this->error('❌ Import failed: ' . $e->getMessage());
            }
        }

        $this->info('🚀 Import process completed.');
    }
}
