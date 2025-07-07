<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use App\Models\Organization;
use App\Models\PlantMake;
use App\Models\PlantModel;
use App\Models\PlantType;
use App\Models\Regulation;
use App\Models\Site;
use App\Models\Source;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AlertController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {

            $alerts = Alert::with(['source', 'regulations', 'organization', 'site', 'plantType', 'plantMake', 'plantModel'])
                ->latest()
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

            return inertia('alerts/index', [
                'alerts' => $alerts,
                'sources' => $sources,
                'regulations' => $regulations,
                'organizations' => $organizations,
                'sites' => $sites,
                'plantTypes' => $plantTypes,
                'plantMakes' => $plantMakes,
                'plantModels' => $plantModels,
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
                'organization_id' => 'required|exists:organizations,id',
                'site_id' => 'required|exists:sites,id',
                'type_id' => 'nullable|exists:plant_types,id',
                'make_id' => 'nullable|exists:plant_makes,id',
                'model_id' => 'nullable|exists:plant_models,id',
                'hazards' => 'nullable|string|max:1000',
            ]);

            $regulationIds = $validatedData['regulation_ids'] ?? [];
            unset($validatedData['regulation_ids']);

            $alert = Alert::create($validatedData);

            if (!empty($regulationIds)) {
                $alert->regulations()->attach($regulationIds);
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
                'organization_id' => 'required|exists:organizations,id',
                'site_id' => 'required|exists:sites,id',
                'type_id' => 'nullable|exists:plant_types,id',
                'make_id' => 'nullable|exists:plant_makes,id',
                'model_id' => 'nullable|exists:plant_models,id',
                'hazards' => 'nullable|string|max:1000',
            ]);

            $regulationIds = $validatedData['regulation_ids'] ?? [];
            unset($validatedData['regulation_ids']);

            $alert->update($validatedData);

            $alert->regulations()->sync($regulationIds);

            return redirect()->route('alerts.index')->with('success', 'Alert updated successfully.');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Error updating alert: ' . $e->getMessage());
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
}
