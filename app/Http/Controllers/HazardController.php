<?php

namespace App\Http\Controllers;

use App\Models\Hazard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class HazardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            
            $hazards = Hazard::orderBy('name', 'asc')->get();

            return Inertia::render('hazards/index', [
                'hazards' => $hazards,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching hazards: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        try {
            return Inertia::render('hazards/create');
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
                'name' => 'required|string|max:255',
                'description' => 'nullable|string|max:1000',
                'is_active' => 'boolean',
            ]);

            Hazard::create($validatedData);

            return redirect()->route('hazards.index')->with('success', 'Hazard created successfully.');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Error storing hazard: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {

            $hazard = Hazard::findOrFail($id);

            return Inertia::render('hazards/show', [
                'hazard' => $hazard,
            ]);
        } catch (\Exception $e) {
            Log::error('Error showing hazard: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        try {

            $hazard = Hazard::findOrFail($id);

            return Inertia::render('hazards/edit', [
                'hazard' => $hazard,
            ]);
        } catch (\Exception $e) {
            Log::error('Error show edit form: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Hazard $hazard)
    {
        try {

            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string|max:1000',
                'is_active' => 'boolean',
            ]);

            $hazard->update($validatedData);

            return redirect()->route('hazards.index')->with('success', 'Hazard updated successfully.');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Error updating hazard: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Hazard $hazard)
    {
        try {

            $hazard->delete();

            return redirect()->route('hazards.index')->with('success', 'Hazard deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Error deleting hazard: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
