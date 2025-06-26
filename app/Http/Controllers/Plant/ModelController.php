<?php

namespace App\Http\Controllers\Plant;

use App\Http\Controllers\Controller;
use App\Models\PlantMake;
use App\Models\PlantModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ModelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $plantModels = PlantModel::with('plantMake')->orderBy('name', 'asc')->paginate(10);
            $plantMakes = PlantMake::where('is_active', true)->orderBy('name', 'asc')->get();

            return inertia('plants/models/index', [
                'plantModels' => $plantModels,
                'plantMakes' => $plantMakes,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching plant models: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        try {
            return inertia('plants/models/create');
        } catch (\Exception $e) {
            Log::error('Error showing create form for plant models: ' . $e->getMessage());
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
                'name' => 'required|string|max:255',
                'description' => 'nullable|string|max:1000',
                'is_active' => 'boolean',
            ]);

            PlantModel::create($validatedData);

            return redirect()->route('plant-models.index')->with('success', 'Plant model created successfully.');
        } catch (\Exception $e) {
            Log::error('Error storing plant model: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $model = PlantModel::findOrFail($id);

            return inertia('plants/models/show', [
                'model' => $model,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching plant model: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        try {
            $model = PlantModel::findOrFail($id);

            return inertia('plants/models/edit', [
                'model' => $model,
            ]);
        } catch (\Exception $e) {
            Log::error('Error showing edit form for plant model: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PlantModel $plantModel)
    {
        try {

            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string|max:1000',
                'is_active' => 'boolean',
            ]);

            $plantModel->update($validatedData);

            return redirect()->route('plant-models.index')->with('success', 'Plant model updated successfully.');
        } catch (\Exception $e) {
            Log::error('Error updating plant model: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PlantModel $plantModel)
    {
        try {
            $plantModel->delete();

            return redirect()->route('plant-models.index')->with('success', 'Plant model deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Error deleting plant model: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
