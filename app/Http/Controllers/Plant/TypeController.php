<?php

namespace App\Http\Controllers\Plant;

use App\Http\Controllers\Controller;
use App\Models\PlantType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $plantTypes = PlantType::latest()->paginate(10);

            return inertia('plants/types/index', [
                'plantTypes' => $plantTypes,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching plant types: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        try {
            return inertia('plant/types/create');
        } catch (\Exception $e) {
            Log::error('Error showing create form for plant types: ' . $e->getMessage());
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

            PlantType::create($validatedData);

            return redirect()->route('plant-types.index')->with('success', 'Plant type created successfully.');
        } catch (\Exception $e) {
            Log::error('Error storing plant type: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {

            $type = PlantType::findOrFail($id);

            return inertia('plant/types/show', [
                'type' => $type,
            ]);
        } catch (\Exception $e) {
            Log::error('Error displaying plant type: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        try {

            $type = PlantType::findOrFail($id);

            return inertia('plant/types/edit', [
                'type' => $type,
            ]);
        } catch (\Exception $e) {
            Log::error('Error showing edit form for plant type: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PlantType $plantType)
    {
        try {

            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string|max:1000',
                'is_active' => 'boolean',
            ]);

            $plantType->update($validatedData);

            return redirect()->route('plant-types.index')->with('success', 'Plant type updated successfully.');
        } catch (\Exception $e) {
            Log::error('Error updating plant type: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PlantType $plantType)
    {
        try {
            $plantType->delete();

            return redirect()->route('plant-types.index')->with('success', 'Plant type deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Error deleting plant type: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
