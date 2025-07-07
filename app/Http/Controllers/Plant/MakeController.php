<?php

namespace App\Http\Controllers\Plant;

use App\Http\Controllers\Controller;
use App\Models\PlantMake;
use App\Models\PlantType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class MakeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $plantMakes = PlantMake::with('plantType')
                ->latest()
                ->get();

            $plantTypes = PlantType::where('is_active', true)->orderBy('name', 'asc')->get();

            return inertia('plants/makes/index', [
                'plantMakes' => $plantMakes,
                'plantTypes' => $plantTypes,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching plant makes: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        try {
            return inertia('plants/makes/create');
        } catch (\Exception $e) {
            Log::error('Error showing create form for plant makes: ' . $e->getMessage());
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
                'type_id' => 'required|exists:plant_types,id',
                'name' => 'required|string|max:255',
                'description' => 'nullable|string|max:1000',
                'is_active' => 'boolean',
            ]);

            PlantMake::create($validatedData);

            return redirect()->route('plant-makes.index')->with('success', 'Plant make created successfully.');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Error storing plant make: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $make = PlantMake::findOrFail($id);

            return inertia('plants/makes/show', [
                'make' => $make,
            ]);
        } catch (\Exception $e) {
            Log::error('Error showing plant make: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        try {
            $make = PlantMake::findOrFail($id);

            return inertia('plants/makes/edit', [
                'make' => $make,
            ]);
        } catch (\Exception $e) {
            Log::error('Error showing edit form for plant make: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PlantMake $plantMake)
    {
        try {

            $validatedData = $request->validate([
                'type_id' => 'required|exists:plant_types,id',
                'name' => 'required|string|max:255',
                'description' => 'nullable|string|max:1000',
                'is_active' => 'boolean',
            ]);

            $plantMake->update($validatedData);

            return redirect()->route('plant-makes.index')->with('success', 'Plant make updated successfully.');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Error updating plant make: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PlantMake $plantMake)
    {
        try {
            $plantMake->delete();

            return redirect()->route('plant-makes.index')->with('success', 'Plant make deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Error deleting plant make: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
