import DatePicker from "react-datepicker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import React, { useEffect } from "react";
import axios from "axios";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import "react-datepicker/dist/react-datepicker.css";
import { Organization, PlantType, Site, Source } from "../ui/column";
import { Hazard, Regulation } from "../ui/column-alerts";

interface FiltersSidebarProps {
    onFiltersChange: (filters: any) => void;
}

export const FiltersSidebar = ({ onFiltersChange }: FiltersSidebarProps) => {

    const [startDate, setStartDate] = React.useState<Date | null>(null);
    const [endDate, setEndDate] = React.useState<Date | null>(null);

    const [selectedSource, setSelectedSource] = React.useState<string>('');
    const [selectedRegulation, setSelectedRegulation] = React.useState<string>('');
    const [selectedOrganization, setSelectedOrganization] = React.useState<string>('');
    const [selectedSite, setSelectedSite] = React.useState<string>('');
    const [selectedPlantType, setSelectedPlantType] = React.useState<string>('');
    const [selectedHazard, setSelectedHazard] = React.useState<string>('');

    const [sources, setSources] = React.useState([]);
    const [regulations, setRegulations] = React.useState([]);
    const [organizations, setOrganizations] = React.useState([]);
    const [sites, setSites] = React.useState([]);
    const [plantTypes, setPlantTypes] = React.useState([]);
    const [hazards, setHazards] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                setLoading(true);
                const [
                    sourceResponse,
                    regulationResponse,
                    orgResponse,
                    siteResponse,
                    plantTypeResponse,
                    hazardResponse
                ] = await Promise.all([
                    axios.get('/auth/verified/dashboard/filter-options/sources'),
                    axios.get('/auth/verified/dashboard/filter-options/regulations'),
                    axios.get('/auth/verified/dashboard/filter-options/organizations'),
                    axios.get('/auth/verified/dashboard/filter-options/sites'),
                    axios.get('/auth/verified/dashboard/filter-options/plant-types'),
                    axios.get('/auth/verified/dashboard/filter-options/hazards'),
                ]);

                setSources(sourceResponse.data || []);
                setRegulations(regulationResponse.data || []);
                setOrganizations(orgResponse.data || []);
                setSites(siteResponse.data || []);
                setPlantTypes(plantTypeResponse.data || []);
                setHazards(hazardResponse.data || []);

            } catch (error) {
                console.error('Error fetching filter options:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchFilterOptions();
    }, []);

    const handleApplyFilters = () => {
        const filters = {
            start_date: startDate ? startDate.toLocaleDateString('en-AU') : null,
            end_date: endDate ? endDate.toLocaleDateString('en-AU') : null,

            source_id: selectedSource && selectedSource !== 'all' ? selectedSource : null,
            regulation_id: selectedRegulation && selectedRegulation !== 'all' ? selectedRegulation : null,
            organization_id: selectedOrganization && selectedOrganization !== 'all' ? selectedOrganization : null,
            site_id: selectedSite && selectedSite !== 'all' ? selectedSite : null,
            plant_type_id: selectedPlantType && selectedPlantType !== 'all' ? selectedPlantType : null,
            hazard_id: selectedHazard && selectedHazard !== 'all' ? selectedHazard : null,
        }

        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== null && value !== '')
        );

        onFiltersChange(cleanFilters);
    }

    const handleClearFilters = () => {
        setStartDate(null);
        setEndDate(null);
        setSelectedSource('all');
        setSelectedRegulation('all');
        setSelectedOrganization('all');
        setSelectedSite('all');
        setSelectedPlantType('all');
        setSelectedHazard('all');
        onFiltersChange({});
    }

    if (loading) {
        return (
            <div className="mx-auto w-full rounded-md">
                <div className="flex animate-pulse space-x-4">
                    <div className="flex-1 space-y-6 py-1">
                        <div className="h-2 rounded bg-gray-200"></div>
                        <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2 h-2 rounded bg-gray-200"></div>
                                <div className="col-span-1 h-2 rounded bg-gray-200"></div>
                            </div>
                            <div className="h-2 rounded bg-gray-200"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">

            <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="flex flex-col gap-2">
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        placeholderText="Start Date"
                        className="w-full p-2 border rounded"
                        dateFormat="dd/MM/yyyy"
                    />
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        placeholderText="End Date"
                        className="w-full p-2 border rounded"
                        dateFormat="dd/MM/yyyy"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Source</Label>
                <Select onValueChange={setSelectedSource} value={selectedSource || ""}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Source" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Sources</SelectItem>
                        {sources.length > 0 ? (
                            sources.map((source: Source) => (
                                <SelectItem key={source.id} value={source.id}>
                                    {source.name}
                                </SelectItem>
                            ))
                        ) : (
                            <SelectItem value="no-data" disabled>
                                No sources available
                            </SelectItem>
                        )}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Regulation</Label>
                <Select onValueChange={setSelectedRegulation} value={selectedRegulation || ""}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Regulation" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Regulations</SelectItem>
                        {regulations.length > 0 ? (
                            regulations.map((regulation: Regulation) => (
                                <SelectItem key={regulation.id} value={regulation.id}>
                                    {regulation.section}
                                </SelectItem>
                            ))
                        ) : (
                            <SelectItem value="no-data" disabled>
                                No regulations available
                            </SelectItem>
                        )}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Organization</Label>
                <Select onValueChange={setSelectedOrganization} value={selectedOrganization || ""}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Organization" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Organizations</SelectItem>
                        {organizations.length > 0 ? (
                            organizations.map((organization: Organization) => (
                                <SelectItem key={organization.id} value={organization.id}>
                                    {organization.name}
                                </SelectItem>
                            ))
                        ) : (
                            <SelectItem value="no-data" disabled>
                                No organizations available
                            </SelectItem>
                        )}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Site</Label>
                <Select onValueChange={setSelectedSite} value={selectedSite || ""}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Site" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Sites</SelectItem>
                        {sites.length > 0 ? (
                            sites.map((site: Site) => (
                                <SelectItem key={site.id} value={site.id}>
                                    {site.name}
                                </SelectItem>
                            ))
                        ) : (
                            <SelectItem value="no-data" disabled>
                                No sites available
                            </SelectItem>
                        )}
                    </SelectContent>
                </Select>
            </div>
            
            <div className="space-y-2">
                <Label>Equipment (Std)</Label>
                <Select onValueChange={setSelectedPlantType} value={selectedPlantType || ""}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Plant Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {plantTypes.length > 0 ? (
                            plantTypes.map((plantType: PlantType) => (
                                <SelectItem key={plantType.id} value={plantType.id}>
                                    {plantType.name}
                                </SelectItem>
                            ))
                        ) : (
                            <SelectItem value="no-data" disabled>
                                No plant types available
                            </SelectItem>
                        )}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Hazard</Label>
                <Select onValueChange={setSelectedHazard} value={selectedHazard || ""}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Hazard" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Hazards</SelectItem>
                        {hazards.length > 0 ? (
                            hazards.map((hazard: Hazard) => (
                                <SelectItem key={hazard.id} value={hazard.id}>
                                    {hazard.name}
                                </SelectItem>
                            ))
                        ) : (
                            <SelectItem value="no-data" disabled>
                                No hazards available
                            </SelectItem>
                        )}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex gap-2 pt-4">
                <Button onClick={handleApplyFilters} className="flex-1">
                    Apply Filters
                </Button>
                <Button onClick={handleClearFilters} variant="outline" className="flex-1">
                    Clear Filters
                </Button>
            </div>
        </div>
    );
}