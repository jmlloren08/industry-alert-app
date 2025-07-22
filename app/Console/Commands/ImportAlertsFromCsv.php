<?php

namespace App\Console\Commands;

use App\Models\Alert;
use App\Models\Hazard;
use App\Models\Organization;
use App\Models\PlantMake;
use App\Models\PlantModel;
use App\Models\PlantType;
use App\Models\Regulation;
use App\Models\Site;
use App\Models\Source;
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

                $alertId = (string) Str::uuid();
                // Fetch FK IDs // Lookups
                $sourceId = Source::where('name', $record['source_id'])->value('id');
                $organizationId = Organization::where('name', $record['organization_id'])->value('id');
                $siteId = Site::where('name', $record['site_id'])->value('id');
                $plantTypeId = PlantType::where('name', $record['type_id'])->value('id');
                $plantMakeId = PlantMake::where('name', $record['make_id'])->where('type_id', $plantTypeId)->value('id');
                $plantModelId = PlantModel::where('name', $record['model_id'])->where('make_id', $plantMakeId)->value('id');

                $description  = $record['description'];

                $description = str_replace(["\xA0", "\xC2\xA0"], ' ', $description);
                $description = preg_replace('/[\s\p{Zs}\x{00a0}]+$/u', '', $description);
                $description = trim($description);

                // Insert into alerts table
                Alert::insert([
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
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Handle regulations (pivot table)
                $regulations = array_map('trim', explode(',', $record['regulation_id']));

                foreach ($regulations as $regCode) {
                    $regulationId = Regulation::where('section', $regCode)->value('id');
                    if ($regulationId) {
                        DB::table('alerts_regulations')->insert([
                            'alert_id' => $alertId,
                            'regulation_id' => $regulationId,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }

                // Handle hazards (pivot table)
                $hazards = array_map('trim', explode(',', $record['hazard_id']));

                foreach ($hazards as $hazardName) {
                    $hazardId = Hazard::where('name', $hazardName)->value('id');
                    if ($hazardId) {
                        DB::table('alerts_hazards')->insert([
                            'alert_id' => $alertId,
                            'hazard_id' => $hazardId,
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
