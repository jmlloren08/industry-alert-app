<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use App\Models\Hazard;
use App\Models\Organization;
use App\Models\PlantType;
use App\Models\Regulation;
use App\Models\Site;
use App\Models\Source;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            return Inertia::render('dashboard');
        } catch (\Exception $e) {
            Log::error('Error loading dashboard: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error loading dashboard: ' . $e->getMessage());
        }
    }

    public function getMetrics(Request $request)
    {
        try {
            // Current month data
            $currentMonth = now()->format('Y-m');
            $lastMonth = now()->subMonth()->format('Y-m');

            // Total alerts current vs last month
            $totalAlertsThisMonth = Alert::whereRaw('DATE_FORMAT(incident_date, "%Y-%m") = ?', [$currentMonth])->count();
            $totalAlertsLastMonth = Alert::whereRaw('DATE_FORMAT(incident_date, "%Y-%m") = ?', [$lastMonth])->count();

            $alertsTrend = $this->calculateTrend($totalAlertsThisMonth, $totalAlertsLastMonth);

            // Sources trend
            $sourcesThisMonth = Alert::whereRaw('DATE_FORMAT(incident_date, "%Y-%m") = ?', [$currentMonth])
                ->distinct('source_id')
                ->count('source_id');
            $sourcesLastMonth = Alert::whereRaw('DATE_FORMAT(incident_date, "%Y-%m") = ?', [$lastMonth])
                ->distinct('source_id')
                ->count('source_id');

            $sourcesTrend = $this->calculateTrend($sourcesThisMonth, $sourcesLastMonth);

            // Regulations trend
            $regulationsThisMonth = Alert::whereRaw('DATE_FORMAT(incident_date, "%Y-%m") = ?', [$currentMonth])
                ->with('regulations')
                ->get()
                ->flatMap->regulations
                ->unique('id')
                ->count();
            $regulationsLastMonth = Alert::whereRaw('DATE_FORMAT(incident_date, "%Y-%m") = ?', [$lastMonth])
                ->with('regulations')
                ->get()
                ->flatMap->regulations
                ->unique('id')
                ->count();

            $regulationsTrend = $this->calculateTrend($regulationsThisMonth, $regulationsLastMonth);

            // Organization trend
            $organizationsThisMonth = Alert::whereRaw('DATE_FORMAT(incident_date, "%Y-%m") = ?', [$currentMonth])
                ->distinct('organization_id')
                ->count('organization_id');
            $organizationsLastMonth = Alert::whereRaw('DATE_FORMAT(incident_date, "%Y-%m") = ?', [$lastMonth])
                ->distinct('organization_id')
                ->count('organization_id');

            $organizationsTrend = $this->calculateTrend($organizationsThisMonth, $organizationsLastMonth);

            // Sites trend
            $sitesThisMonth = Alert::whereRaw('DATE_FORMAT(incident_date, "%Y-%m") = ?', [$currentMonth])
                ->distinct('site_id')
                ->count('site_id');
            $sitesLastMonth = Alert::whereRaw('DATE_FORMAT(incident_date, "%Y-%m") = ?', [$lastMonth])
                ->distinct('site_id')
                ->count('site_id');

            $sitesTrend = $this->calculateTrend($sitesThisMonth, $sitesLastMonth);

            // Plant Types trend
            $plantTypesThisMonth = Alert::whereRaw('DATE_FORMAT(incident_date, "%Y-%m") = ?', [$currentMonth])
                ->distinct('type_id')
                ->count('type_id');
            $plantTypesLastMonth = Alert::whereRaw('DATE_FORMAT(incident_date, "%Y-%m") = ?', [$lastMonth])
                ->distinct('type_id')
                ->count('type_id');

            $plantTypesTrend = $this->calculateTrend($plantTypesThisMonth, $plantTypesLastMonth);

            // Hazards trend
            $hazardsThisMonth = Alert::whereRaw('DATE_FORMAT(incident_date, "%Y-%m") = ?', [$currentMonth])
                ->with('hazards')
                ->get()
                ->flatMap->hazards
                ->unique('id')
                ->count();
            $hazardsLastMonth = Alert::whereRaw('DATE_FORMAT(incident_date, "%Y-%m") = ?', [$lastMonth])
                ->with('hazards')
                ->get()
                ->flatMap->hazards
                ->unique('id')
                ->count();

            $hazardsTrend = $this->calculateTrend($hazardsThisMonth, $hazardsLastMonth);

            return response()->json([
                'total_alerts' => Alert::count(),
                'total_sources' => Alert::distinct('source_id')->count(),
                'total_regulations' => Alert::with('regulations')->get()->flatMap->regulations->unique('id')->count(),
                'total_organizations' => Alert::distinct('organization_id')->count(),
                'total_sites' => Alert::distinct('site_id')->count(),
                'total_plant_types' => Alert::distinct('type_id')->count(),
                'total_hazards' => Alert::with('hazards')->get()->flatMap->hazards->unique('id')->count(),
                // trend data
                'trends' => [
                    'alerts' => $alertsTrend,
                    'sources' => $sourcesTrend,
                    'regulations' => $regulationsTrend,
                    'organizations' => $organizationsTrend,
                    'sites' => $sitesTrend,
                    'plant_types' => $plantTypesTrend,
                    'hazards' => $hazardsTrend,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching metrics: ' . $e->getMessage());
            return response()->json(['error' => 'Error fetching metrics: ' . $e->getMessage()], 500);
        }
    }

    public function getAlertsOverTime(Request $request)
    {
        try {
            $data = Alert::selectRaw('DATE_FORMAT(incident_date, "%Y-%m") as month, COUNT(*) as count')
                ->groupBy('month')
                ->orderBy('month')
                ->get();

            return response()->json($data);
        } catch (\Exception $e) {
            Log::error('Error fetching alerts over time: ' . $e->getMessage());
            return response()->json(['error' => 'Error fetching alerts over time: ' . $e->getMessage()], 500);
        }
    }

    public function getRecentAlerts(Request $request)
    {
        try {
            $alerts = Alert::with(['source', 'regulations', 'organization', 'site', 'plantType', 'plantMake', 'plantModel', 'hazards'])
                ->latest('incident_date')
                ->take(10)
                ->get();

            return response()->json($alerts);
        } catch (\Exception $e) {
            Log::error('Error fetching recent alerts: ' . $e->getMessage());
            return response()->json(['error' => 'Error fetching recent alerts: ' . $e->getMessage()], 500);
        }
    }

    public function getAlertsBySource()
    {
        try {
            $data = Alert::with('source')
                ->whereHas('source')
                ->get()
                ->groupBy('source.name')
                ->map(fn($group, $name) => [
                    'name' => $name,
                    'count' => $group->count(),
                ])
                ->values()
                ->sortByDesc('count')
                ->take(10)
                ->values();

            return response()->json($data);
        } catch (\Exception $e) {
            Log::error('Error fetching alerts by source: ' . $e->getMessage());
            return response()->json(['error' => 'Error fetching alerts by source: ' . $e->getMessage()], 500);
        }
    }

    public function getAlertsByRegulation()
    {
        try {
            $data = Alert::with('regulations')
                ->get()
                ->flatMap(fn($alert) => $alert->regulations)
                ->groupBy('section')
                ->map(fn($group, $section) => [
                    'name' => $section,
                    'count' => $group->count(),
                ])
                ->values()
                ->sortByDesc('count')
                ->take(10)
                ->values();

            return response()->json($data);
        } catch (\Exception $e) {
            Log::error('Error fetching alerts by regulation: ' . $e->getMessage());
            return response()->json(['error' => 'Error fetching alerts by regulation: ' . $e->getMessage()], 500);
        }
    }

    public function getAlertsByOrganization()
    {
        try {
            $data = Alert::with('organization')
                ->whereHas('organization')
                ->get()
                ->groupBy('organization.name')
                ->map(fn($group, $name) => [
                    'name' => $name,
                    'count' => $group->count(),
                ])
                ->values()
                ->sortByDesc('count')
                ->take(10)
                ->values();

            return response()->json($data);
        } catch (\Exception $e) {
            Log::error('Error fetching alerts by organization: ' . $e->getMessage());
            return response()->json(['error' => 'Error fetching alerts by organization: ' . $e->getMessage()], 500);
        }
    }

    public function getAlertsBySite()
    {
        try {
            $data = Alert::with('site')
                ->whereHas('site')
                ->get()
                ->groupBy('site.name')
                ->map(fn($group, $name) => [
                    'name' => $name,
                    'count' => $group->count(),
                ])
                ->values()
                ->sortByDesc('count')
                ->take(10)
                ->values();

            return response()->json($data);
        } catch (\Exception $e) {
            Log::error('Error fetching alerts by site: ' . $e->getMessage());
            return response()->json(['error' => 'Error fetching alerts by site: ' . $e->getMessage()], 500);
        }
    }

    public function getAlertsByHazard()
    {
        try {
            $data = Alert::with('hazards')
                ->get()
                ->flatMap(fn($alert) => $alert->hazards)
                ->groupBy('name')
                ->map(fn($group, $name) => [
                    'name' => $name,
                    'count' => $group->count(),
                ])
                ->values()
                ->sortByDesc('count')
                ->take(10)
                ->values();

            return response()->json($data);
        } catch (\Exception $e) {
            Log::error('Error fetching alerts by hazard: ' . $e->getMessage());
            return response()->json(['error' => 'Error fetching alerts by hazard: ' . $e->getMessage()], 500);
        }
    }

    public function getAlertsByPlantType()
    {
        try {
            $data = Alert::with('plantType')
                ->whereHas('plantType')
                ->get()
                ->groupBy('plantType.name')
                ->map(fn($group, $name) => [
                    'name' => $name,
                    'count' => $group->count(),
                ])
                ->values()
                ->sortByDesc('count')
                ->take(10)
                ->values();

            return response()->json($data);
        } catch (\Exception $e) {
            Log::error('Error fetching alerts by plant type: ' . $e->getMessage());
            return response()->json(['error' => 'Error fetching alerts by plant type: ' . $e->getMessage()], 500);
        }
    }

    public function getSources()
    {
        try {
            $sources = Source::where('is_active', true)
                ->select('id', 'name')
                ->orderBy('name', 'asc')
                ->get();

            return response()->json($sources);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching sources: ' . $e->getMessage()], 500);
        }
    }

    public function getRegulations()
    {
        try {
            $regulations = Regulation::where('is_active', true)
                ->select('id', 'section')
                ->orderBy('section', 'asc')
                ->get();

            return response()->json($regulations);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching regulations: ' . $e->getMessage()], 500);
        }
    }

    public function getOrganizations()
    {
        try {
            $organizations = Organization::where('is_active', true)
                ->select('id', 'name')
                ->orderBy('name', 'asc')
                ->get();

            return response()->json($organizations);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching organizations: ' . $e->getMessage()], 500);
        }
    }

    public function getSites()
    {
        try {
            $sites = Site::where('is_active', true)
                ->select('id', 'name')
                ->orderBy('name', 'asc')
                ->get();

            return response()->json($sites);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching sites: ' . $e->getMessage()], 500);
        }
    }

    public function getPlantTypes()
    {
        try {
            $plantTypes = PlantType::where('is_active', true)
                ->select('id', 'name')
                ->orderBy('name', 'asc')
                ->get();

            return response()->json($plantTypes);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching plant types: ' . $e->getMessage()], 500);
        }
    }

    public function getHazards()
    {
        try {
            $hazards = Hazard::where('is_active', true)
                ->select('id', 'name')
                ->orderBy('name', 'asc')
                ->get();

            return response()->json($hazards);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching hazards: ' . $e->getMessage()], 500);
        }
    }

    public function getFilteredData(Request $request)
    {
        try {

            $query = Alert::with(['source', 'regulations', 'organization', 'site', 'plantType', 'hazards']);

            if ($request->start_date) {
                $startDate = DateTime::createFromFormat('d/m/Y', $request->start_date);
                if ($startDate) {
                    $query->whereDate('incident_date', '>=', $startDate->format('Y-m-d'));
                }
            }

            if ($request->end_date) {
                $endDate = DateTime::createFromFormat('d/m/Y', $request->end_date);
                if ($endDate) {
                    $query->whereDate('incident_date', '<=', $endDate->format('Y-m-d'));
                }
            }

            if ($request->source_id) {
                $query->where('source_id', $request->source_id);
            }

            if ($request->regulation_id) {
                $query->whereHas('regulations', function ($q) use ($request) {
                    $q->where('regulations.id', $request->regulation_id);
                });
            }

            if ($request->organization_id) {
                $query->where('organization_id', $request->organization_id);
            }

            if ($request->site_id) {
                $query->where('site_id', $request->site_id);
            }

            if ($request->plant_type_id) {
                $query->where('type_id', $request->plant_type_id);
            }

            if ($request->hazard_id) {
                $query->whereHas('hazards', function ($q) use ($request) {
                    $q->where('hazards.id', $request->hazard_id);
                });
            }

            $alerts = $query->latest('incident_date')->get();

            // Calculate metrics from filtered data
            $metrics = [
                'total_alerts' => $alerts->count(),
                'total_sources' => $alerts->pluck('source_id')->filter()->unique()->count(),

                'total_regulations' => $alerts->flatMap(function ($alert) {
                    return $alert->regulations->pluck('id');
                })->unique()->count(),

                'total_organizations' => $alerts->pluck('organization_id')->filter()->unique()->count(),
                'total_sites' => $alerts->pluck('site_id')->filter()->unique()->count(),
                'total_plant_types' => $alerts->pluck('type_id')->filter()->unique()->count(),

                'total_hazards' => $alerts->flatMap(function ($alert) {
                    return $alert->hazards->pluck('id');
                })->unique()->count(),
            ];

            return response()->json([
                'alerts' => $alerts,
                'metrics' => $metrics,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching filtered data: ' . $e->getMessage());
            return response()->json(['error' => 'Error fetching filtered data: ' . $e->getMessage()], 500);
        }
    }

    private function calculateTrend($current, $previous)
    {
        try {
            if ($previous == 0) {
                return [
                    'percentage' => $current > 0 ? 100 : 0,
                    'direction' => $current > 0 ? 'up' : 'stable',
                    'text' => $current > 0 ? '+100% from last month' : 'No change from last month'
                ];
            }
            // Formula to calculate percentage change
            $percentage = (($current - $previous) / $previous) * 100;
            $direction = $percentage > 0 ? 'up' : ($percentage < 0 ? 'down' : 'stable');

            $sign = $percentage > 0 ? '+' : '';
            $text = $percentage == 0 ? 'No change from last month' : "{$sign}" . number_format($percentage, 1) . '% from last month';

            return [
                'percentage' => abs($percentage),
                'direction' => $direction,
                'text' => $text,
            ];
        } catch (\Exception $e) {
            Log::error('Error calculating trend: ' . $e->getMessage());
            return [
                'percentage' => 0,
                'direction' => 'stable',
                'text' => 'Error calculating trend'
            ];
        }
    }
}
