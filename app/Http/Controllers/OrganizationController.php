<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class OrganizationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $organizations = Organization::latest()->paginate(10);

            return inertia('organizations/index', [
                'organizations' => $organizations,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching organizations: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        try {
            return inertia('organizations/create');
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

            Organization::create($validatedData);

            return redirect()->route('organizations.index')->with('success', 'Organization created successfully.');
        } catch (\Exception $e) {
            Log::error('Error storing organization: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $organization = Organization::findOrFail($id);

            return inertia('organizations/show', [
                'organization' => $organization,
            ]);
        } catch (\Exception $e) {
            Log::error('Error showing organization: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        try {
            $organization = Organization::findOrFail($id);

            return inertia('organizations/edit', [
                'organization' => $organization,
            ]);
        } catch (\Exception $e) {
            Log::error('Error showing edit form: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Organization $organization)
    {
        try {

            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string|max:1000',
                'is_active' => 'boolean',
            ]);

            $organization->update($validatedData);

            return redirect()->route('organizations.index')->with('success', 'Organization updated successfully.');
        } catch (\Exception $e) {
            Log::error('Error updating organization: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Organization $organization)
    {
        try {
            $organization->delete();

            return redirect()->route('organizations.index')->with('success', 'Organization deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Error deleting organization: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
