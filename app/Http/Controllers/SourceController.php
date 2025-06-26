<?php

namespace App\Http\Controllers;

use App\Models\Source;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $sources = Source::orderBy('name', 'asc')->paginate(10);

            return inertia('sources/index', [
                'sources' => $sources,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching sources: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        try {
            return inertia('sources/create');
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

            Source::create($validatedData);

            return redirect()->route('sources.index')->with('success', 'Source created successfully.');
        } catch (\Exception $e) {
            Log::error('Error storing source: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $source = Source::findOrFail($id);

            return inertia('sources/show', [
                'source' => $source,
            ]);
        } catch (\Exception $e) {
            Log::error('Error showing source: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        try {
            $source = Source::findOrFail($id);

            return inertia('sources/edit', [
                'source' => $source,
            ]);
        } catch (\Exception $e) {
            Log::error('Error showing edit form: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Source $source)
    {
        try {

            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string|max:1000',
                'is_active' => 'boolean',
            ]);

            $source->update($validatedData);

            return redirect()->route('sources.index')->with('success', 'Source updated successfully.');
        } catch (\Exception $e) {
            Log::error('Error updating source: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Source $source)
    {
        try {
            $source->delete();

            return redirect()->route('sources.index')->with('success', 'Source deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Error deleting source: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
