<?php

namespace App\Http\Controllers;

use App\Models\Regulation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class RegulationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $regulations = Regulation::orderBy('section', 'asc')->get();

            return inertia('regulations/index', [
                'regulations' => $regulations,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching regulations: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        try {
            return inertia('regulations/create');
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
                'section' => 'required|string|max:255',
                'description' => 'nullable|string|max:1000',
                'is_active' => 'boolean',
            ]);

            Regulation::create($validatedData);

            return redirect()->route('regulations.index')->with('success', 'Regulation created successfully.');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Error storing regulation: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $regulations = Regulation::findOrFail($id);

            return inertia('regulations/show', [
                'regulations' => $regulations,
            ]);
        } catch (\Exception $e) {
            Log::error('Error showing regulations: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        try {
            $regulations = Regulation::findOrFail($id);

            return inertia('regulations/edit', [
                'regulations' => $regulations,
            ]);
        } catch (\Exception $e) {
            Log::error('Error showing edit form: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Regulation $regulation)
    {
        try {

            $validatedData = $request->validate([
                'section' => 'required|string|max:255',
                'description' => 'nullable|string|max:1000',
                'is_active' => 'boolean',
            ]);

            $regulation->update($validatedData);

            return redirect()->route('regulations.index')->with('success', 'Regulation updated successfully.');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Error updating regulation: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Regulation $regulation)
    {
        try {
            $regulation->delete();

            return redirect()->route('regulations.index')->with('success', 'Regulation deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Error deleting regulation: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
