<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use App\Models\Hazard;
use App\Models\Organization;
use App\Models\PlantMake;
use App\Models\PlantModel;
use App\Models\PlantType;
use App\Models\Regulation;
use App\Models\Site;
use App\Models\Source;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AlertController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {

            $alerts = Alert::with(['source', 'regulations', 'organization', 'site', 'plantType', 'plantMake', 'plantModel', 'hazards', 'reviewer'])
                ->orderBy('updated_at', 'desc')
                ->get();

            $sources = Source::where('is_active', true)
                ->orderBy('name', 'asc')
                ->get();

            $regulations = Regulation::where('is_active', true)
                ->orderBy('section', 'asc')
                ->get();

            $organizations = Organization::where('is_active', true)
                ->orderBy('name', 'asc')
                ->get();

            $sites = Site::where('is_active', true)
                ->orderBy('name', 'asc')
                ->get();

            $plantTypes = PlantType::where('is_active', true)
                ->orderBy('name', 'asc')
                ->get();

            $plantMakes = PlantMake::where('is_active', true)
                ->orderBy('name', 'asc')
                ->get();

            $plantModels = PlantModel::where('is_active', true)
                ->orderBy('name', 'asc')
                ->get();

            $hazards = Hazard::where('is_active', true)
                ->orderBy('name', 'asc')
                ->get();

            return inertia('alerts/index', [
                'alerts' => $alerts,
                'sources' => $sources,
                'regulations' => $regulations,
                'organizations' => $organizations,
                'sites' => $sites,
                'plantTypes' => $plantTypes,
                'plantMakes' => $plantMakes,
                'plantModels' => $plantModels,
                'hazards' => $hazards,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching alerts: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        try {
            return inertia('alerts/create');
        } catch (\Exception $e) {
            Log::error('Error showing create form: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {

            $validatedData = $request->validate([
                'number' => 'required|string|max:255',
                'source_id' => 'required|exists:sources,id',
                'incident_date' => 'required|date',
                'description' => 'nullable|string|max:1000',
                'hyperlink_url' => 'nullable|url|max:255',
                'regulation_ids' => 'nullable|array',
                'regulation_ids.*' => 'uuid|exists:regulations,id',
                'organization_id' => 'nullable|exists:organizations,id',
                'site_id' => 'nullable|exists:sites,id',
                'type_id' => 'nullable|exists:plant_types,id',
                'make_id' => 'nullable|exists:plant_makes,id',
                'model_id' => 'nullable|exists:plant_models,id',
                'hazard_ids' => 'nullable|array',
                'hazard_ids.*' => 'uuid|exists:hazards,id',
            ]);

            $regulationIds = $validatedData['regulation_ids'] ?? [];
            unset($validatedData['regulation_ids']);

            $hazardIds = $validatedData['hazard_ids'] ?? [];
            unset($validatedData['hazard_ids']);

            $alert = Alert::create($validatedData);

            if (!empty($regulationIds)) {
                $alert->regulations()->attach($regulationIds);
            }

            if (!empty($hazardIds)) {
                $alert->hazards()->attach($hazardIds);
            }

            return redirect()->route('alerts.index')->with('success', 'Alert created successfully.');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Error storing alert: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $alerts = Alert::findOrFail($id);

            return inertia('alerts/show', [
                'alerts' => $alerts,
            ]);
        } catch (\Exception $e) {
            Log::error('Error showing alert: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        try {
            $alert = Alert::findOrFail($id);

            return inertia('alerts/edit', [
                'alert' => $alert,
            ]);
        } catch (\Exception $e) {
            Log::error('Error showing edit form: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Alert $alert)
    {
        try {

            $validatedData = $request->validate([
                'number' => 'required|string|max:255',
                'source_id' => 'required|exists:sources,id',
                'incident_date' => 'required|date',
                'description' => 'nullable|string|max:1000',
                'hyperlink_url' => 'nullable|url|max:255',
                'regulation_ids' => 'nullable|array',
                'regulation_ids.*' => 'uuid|exists:regulations,id',
                'organization_id' => 'nullable|exists:organizations,id',
                'site_id' => 'nullable|exists:sites,id',
                'type_id' => 'nullable|exists:plant_types,id',
                'make_id' => 'nullable|exists:plant_makes,id',
                'model_id' => 'nullable|exists:plant_models,id',
                'hazard_ids' => 'nullable|array',
                'hazards_ids.*' => 'uuid|exists:hazards,id',
            ]);

            $regulationIds = $validatedData['regulation_ids'] ?? [];
            unset($validatedData['regulation_ids']);

            $hazardIds = $validatedData['hazard_ids'] ?? [];
            unset($validatedData['hazard_ids']);

            $alert->update($validatedData);

            $alert->regulations()->sync($regulationIds);
            $alert->hazards()->sync($hazardIds);

            return redirect()->route('alerts.index')->with('success', 'Alert updated successfully.');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Error updating alert: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function bulkEdit(Request $request)
    {
        try {
            $ids = $request->input('ids', []);

            if (empty($ids)) {
                return redirect()->route('alerts.index')->with('error', 'No alerts selected for bulk edit.');
            }

            $alerts = Alert::with(['source', 'regulations', 'organization', 'site', 'plantType', 'plantMake', 'plantModel', 'hazards'])
                ->whereIn('id', $ids)
                ->get();

            $sources = Source::where('is_active', true)
                ->orderBy('name', 'asc')
                ->get();

            $regulations = Regulation::where('is_active', true)
                ->orderBy('section', 'asc')
                ->get();

            $organizations = Organization::where('is_active', true)
                ->orderBy('name', 'asc')
                ->get();

            $sites = Site::where('is_active', true)
                ->orderBy('name', 'asc')
                ->get();

            $plantTypes = PlantType::where('is_active', true)
                ->orderBy('name', 'asc')
                ->get();

            $plantMakes = PlantMake::where('is_active', true)
                ->orderBy('name', 'asc')
                ->get();

            $plantModels = PlantModel::where('is_active', true)
                ->orderBy('name', 'asc')
                ->get();

            $hazards = Hazard::where('is_active', true)
                ->orderBy('name', 'asc')
                ->get();

            return inertia('alerts/bulk-edit', [
                'alerts' => $alerts,
                'sources' => $sources,
                'regulations' => $regulations,
                'organizations' => $organizations,
                'sites' => $sites,
                'plantTypes' => $plantTypes,
                'plantMakes' => $plantMakes,
                'plantModels' => $plantModels,
                'hazards' => $hazards,
            ]);
        } catch (\Exception $e) {
            Log::error('Error showing bulk edit form: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function bulkUpdate(Request $request)
    {
        try {

            $alertsData = $request->input('alerts', []);

            if (empty($alertsData)) {
                return redirect()->back()->with('error', 'No alerts data provided.');
            }

            DB::beginTransaction();

            foreach ($alertsData as $alertData) {
                $alert = Alert::findOrFail($alertData['id']);
                // Update basic fields
                $alert->update([
                    'number' => $alertData['number'],
                    'source_id' => $alertData['source_id'],
                    'incident_date' => $alertData['incident_date'],
                    'description' => $alertData['description'],
                    'hyperlink_url' => $alertData['hyperlink_url'],
                    'organization_id' => $alertData['organization_id'],
                    'site_id' => $alertData['site_id'],
                    'type_id' => $alertData['type_id'],
                    'make_id' => $alertData['make_id'],
                    'model_id' => $alertData['model_id'],
                ]);

                // Sync many-to-many relationships
                if (isset($alertData['regulation_ids'])) {
                    $alert->regulations()->sync($alertData['regulation_ids']);
                }

                if (isset($alertData['hazard_ids'])) {
                    $alert->hazards()->sync($alertData['hazard_ids']);
                }
            }

            DB::commit();

            $count = count($alertsData);

            return redirect()->route('alerts.index')->with('success', "Successfully updated $count alert(s).");
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Error bulk updating alerts: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function builkDelete(Request $request)
    {
        try {
            $ids = $request->input('ids', []);

            if (empty($ids)) {
                return redirect()->back()->with('error', 'No alerts selected for deletion.');
            }

            // Validate that all IDs exist
            $alerts = Alert::whereIn('id', $ids)->get();

            if ($alerts->count() !== count($ids)) {
                return redirect()->back()->with('error', 'Some selected alerts do not exist.');
            }

            DB::beginTransaction();

            // Delete alerts
            foreach ($alerts as $alert) {
                // Detach relationships before deletion
                $alert->regulations()->detach();
                $alert->hazards()->detach();
                $alert->delete();
            }

            DB::commit();

            $count = count($ids);

            return redirect()->route('alerts.index')->with('success', "Successfully deleted $count alert(s).");
        } catch (\Exception $e) {
            Log::error('Error bulk deleting alerts: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Alert $alert)
    {
        try {
            $alert->delete();

            return redirect()->route('alerts.index')->with('success', 'Alert deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Error deleting alert: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function markAsReviewed(Alert $alert)
    {
        try {
            $alert->markAsReviewed();

            return response()->json([
                'success' => true,
                'message' => 'Alert marked as reviewed successfully.',
                'alert' => $alert->load(['reviewer'])
            ]);
        } catch (\Exception $e) {
            Log::error('Error marking alert as reviewed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error marking alert as reviewed: ' . $e->getMessage()
            ], 500);
        }
    }
}
