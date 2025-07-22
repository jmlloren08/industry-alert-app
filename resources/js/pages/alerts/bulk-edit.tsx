import { AppSidebar } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Organization, PlantMake, PlantModel, PlantType, Site, Source } from "@/components/ui/column";
import { Alert, Hazard, Regulation } from "@/components/ui/column-alerts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { Head, Link, router, useForm } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";

interface BulkEditProps {
    alerts: Alert[]
    sources: Source[]
    regulations: Regulation[]
    organizations: Organization[]
    sites: Site[]
    plantTypes: PlantType[]
    plantMakes: PlantMake[]
    plantModels: PlantModel[]
    hazards: Hazard[]
}

export default function BulkEdit({
    alerts,
    sources,
    regulations,
    organizations,
    sites,
    plantTypes,
    plantMakes,
    plantModels,
    hazards,
}: BulkEditProps) {

    const [availablePlantMakes, setAvailablePlantMakes] = useState<{ [key: number]: PlantMake[] }>({});
    const [availablePlantModels, setAvailablePlantModels] = useState<{ [key: number]: PlantModel[] }>({});
    const [loading, setLoading] = useState(true);

    const { data, setData, post, processing, errors, reset } = useForm({
        alerts: alerts.map((alert) => ({
            id: alert.id,
            number: alert.number || '',
            source_id: alert.source?.id || '',
            incident_date: alert.incident_date || '',
            description: alert.description || '',
            hyperlink_url: alert.hyperlink_url || '',
            regulation_ids: alert.regulations?.map((reg) => reg.id) || [],
            organization_id: alert.organization?.id || '',
            site_id: alert.site?.id || '',
            type_id: alert.plant_type?.id || '',
            make_id: alert.plant_make?.id || '',
            model_id: alert.plant_model?.id || '',
            hazard_ids: alert.hazards?.map((hazard) => hazard.id),
        }))
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Show a loading alert while processing
        Swal.fire({
            title: 'Processing...',
            html: 'Please wait while we process your request',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        // Post the form data
        post(route('alerts.bulk-update'));
    }

    const updateAlert = (index: number, field: string, value: any) => {
        setData('alerts', data.alerts.map((alert, i) =>
            i === index ? { ...alert, [field]: value } : alert
        ));
    }

    // Initialize available plant makes and models for each alert
    useEffect(() => {
        const makesByAlert: { [key: number]: PlantMake[] } = {};
        const modelsByAlert: { [key: number]: PlantModel[] } = {};

        data.alerts.forEach((alert, index) => {
            if (alert.type_id) {
                makesByAlert[index] = plantMakes.filter((make) => make.type_id === alert.type_id);
            }
            if (alert.make_id) {
                modelsByAlert[index] = plantModels.filter((model) => model.make_id === alert.make_id);
            }
        });

        setAvailablePlantMakes(makesByAlert);
        setAvailablePlantModels(modelsByAlert);
        setLoading(false);
    }, [plantMakes, plantModels]);

    // Handle type changes for each alert - similar to create.tsx pattern
    useEffect(() => {
        const makesByAlert: { [key: number]: PlantMake[] } = {};
        const modelsByAlert: { [key: number]: PlantModel[] } = {};

        data.alerts.forEach((alert, index) => {
            if (alert.type_id) {
                const filteredMakes = plantMakes.filter((make) => make.type_id === alert.type_id);
                makesByAlert[index] = filteredMakes;

                // Clear make_id and model_id if they don't belong to the new type
                const validMake = filteredMakes.find(make => make.id === alert.make_id);
                if (!validMake) {
                    // Update the alert data to clear make_id and model_id
                    setData('alerts', data.alerts.map((a, i) =>
                        i === index ? { ...a, make_id: '', model_id: '' } : a
                    ));
                }
            } else {
                makesByAlert[index] = [];
                modelsByAlert[index] = [];
            }
        });

        setAvailablePlantMakes(makesByAlert);
        setAvailablePlantModels(prev => ({ ...prev, ...modelsByAlert }));
    }, [data.alerts.map(alert => alert.type_id).join(',')]);

    // Handle make changes for each alert - similar to create.tsx pattern
    useEffect(() => {
        const modelsByAlert: { [key: number]: PlantModel[] } = {};

        data.alerts.forEach((alert, index) => {
            if (alert.make_id) {
                const filteredModels = plantModels.filter((model) => model.make_id === alert.make_id);
                modelsByAlert[index] = filteredModels;

                // Clear model_id if it doesn't belong to the new make
                const validModel = filteredModels.find(model => model.id === alert.model_id);
                if (!validModel) {
                    // Update the alert data to clear model_id
                    setData('alerts', data.alerts.map((a, i) =>
                        i === index ? { ...a, model_id: '' } : a
                    ));
                }
            } else {
                modelsByAlert[index] = [];
            }
        });

        setAvailablePlantModels(prev => ({ ...prev, ...modelsByAlert }));
    }, [data.alerts.map(alert => alert.make_id).join(',')]);

    const selectStyles = {
        control: (base: any, state: any) => ({
            ...base,
            borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
            boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
            '&:hover': {
                borderColor: '3b82f6',
            },
        }),
    };

    const sourceOptions = sources.map((source) => ({
        value: source.id,
        label: source.name,
    })) || [];

    const regulationOptions = regulations.map((regulation) => ({
        value: regulation.id,
        label: regulation.section,
    })) || [];

    const organizationOptions = organizations.map((organization) => ({
        value: organization.id,
        label: organization.name,
    })) || [];

    const siteOptions = sites.map((site) => ({
        value: site.id,
        label: site.name,
    })) || [];

    const plantTypeOptions = plantTypes.map((plantType) => ({
        value: plantType.id,
        label: plantType.name,
        description: plantType.description,
    })) || [];

    const hazardOptions = hazards.map((hazard) => ({
        value: hazard.id,
        label: hazard.name,
    })) || [];

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Head title="Bulk Edit Alerts" />
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="#">
                                            Home
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href={route('alerts.index')}>
                                            Alerts
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Bulk Edit</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>

                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        <div className="flex items-center justify-between sticky top-0 z-50 bg-white border-b border-gray-200 p-4 -mx-4 shadow-sm">
                            <h1 className="text-2xl font-bold">Bulk Edit Alerts</h1>
                            <div className="flex gap-2">
                                <Link href={route('alerts.index')}>
                                    <Button variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button onClick={handleSubmit} disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {data.alerts.map((alert, index) => {
                            const plantMakeOptions = (availablePlantMakes[index] || []).map((plantMake) => ({
                                value: plantMake.id,
                                label: plantMake.name,
                                description: plantMake.description,
                            }));

                            const plantModelOptions = (availablePlantModels[index] || []).map((plantModel) => ({
                                value: plantModel.id,
                                label: plantModel.name,
                                description: plantModel.description,
                            }));

                            return (
                                <div className="p-2" key={alert.id}>
                                    <Card key={alert.id}>
                                        <CardHeader>
                                            <CardTitle><Badge variant="secondary">Item #: {index + 1}</Badge></CardTitle>
                                        </CardHeader>
                                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor={`number-${index}`}>Alert Number</Label>
                                                <Input
                                                    id={`number-${index}`}
                                                    value={data.alerts[index].number}
                                                    onChange={(e) => updateAlert(index, 'number', e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <Label>Source</Label>
                                                <Select
                                                    options={sourceOptions}
                                                    value={sourceOptions.find((option) => option.value === data.alerts[index].source_id) || null}
                                                    onChange={(selectedOption) => updateAlert(index, 'source_id', selectedOption?.value || '')}
                                                    placeholder="Select a source..."
                                                    isClearable
                                                    isSearchable
                                                    styles={selectStyles}
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor={`incident_date-${index}`}>Incident Date</Label>
                                                <Input
                                                    type="date"
                                                    id={`incident_date-${index}`}
                                                    value={data.alerts[index].incident_date}
                                                    onChange={(e) => updateAlert(index, 'incident_date', e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <Label htmlFor={`description-${index}`}>Description</Label>
                                                <Textarea
                                                    id={`description-${index}`}
                                                    value={data.alerts[index].description}
                                                    onChange={(e) => updateAlert(index, 'description', e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <Label htmlFor={`hyperlink_url-${index}`}>Hyperlink URL</Label>
                                                <Input
                                                    type="url"
                                                    id={`hyperlink_url-${index}`}
                                                    value={data.alerts[index].hyperlink_url}
                                                    onChange={(e) => updateAlert(index, 'hyperlink_url', e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <Label>Regulations</Label>
                                                <Select
                                                    isMulti
                                                    options={regulationOptions}
                                                    value={regulationOptions.filter((option) => data.alerts[index].regulation_ids.includes(option.value))}
                                                    onChange={(selectedOptions) => {
                                                        const values = selectedOptions?.map((option) => option.value) || [];
                                                        updateAlert(index, 'regulation_ids', values);
                                                    }}
                                                    placeholder="Select regulations..."
                                                    isClearable
                                                    isSearchable
                                                    styles={selectStyles}
                                                />
                                            </div>

                                            <div>
                                                <Label>Organization</Label>
                                                <Select
                                                    options={organizationOptions}
                                                    value={organizationOptions.find((option) => option.value === data.alerts[index].organization_id) || null}
                                                    onChange={(selectedOption) => updateAlert(index, 'organization_id', selectedOption?.value || '')}
                                                    placeholder="Select an organization..."
                                                    isClearable
                                                    isSearchable
                                                    styles={selectStyles}
                                                />
                                            </div>

                                            <div>
                                                <Label>Site</Label>
                                                <Select
                                                    options={siteOptions}
                                                    value={siteOptions.find((option) => option.value === data.alerts[index].site_id) || null}
                                                    onChange={(selectedOption) => updateAlert(index, 'site_id', selectedOption?.value || '')}
                                                    placeholder="Select a site..."
                                                    isClearable
                                                    isSearchable
                                                    styles={selectStyles}
                                                />
                                            </div>

                                            <div>
                                                <Label>Equipment (Std)</Label>
                                                <Select
                                                    options={plantTypeOptions}
                                                    value={plantTypeOptions.find((option) => option.value === data.alerts[index].type_id) || null}
                                                    onChange={(selectedOption) => updateAlert(index, 'type_id', selectedOption?.value || '')}
                                                    placeholder="Select a plant type..."
                                                    isClearable
                                                    isSearchable
                                                    styles={selectStyles}
                                                    formatOptionLabel={(option: any) => (
                                                        <div>
                                                            <div className="font-medium">{option.label}</div>
                                                            {option.description && (
                                                                <div className="text-sm text-gray-500">{option.description}</div>
                                                            )}
                                                        </div>
                                                    )}
                                                />
                                            </div>

                                            <div>
                                                <Label>Make (Std)</Label>
                                                <Select
                                                    options={plantMakeOptions}
                                                    value={plantMakeOptions.find((option) => option.value === data.alerts[index].make_id) || null}
                                                    onChange={(selectedOption) => updateAlert(index, 'make_id', selectedOption?.value || '')}
                                                    placeholder="Select a plant make..."
                                                    isClearable
                                                    isSearchable
                                                    styles={selectStyles}
                                                    formatOptionLabel={(option: any) => (
                                                        <div>
                                                            <div className="font-medium">{option.label}</div>
                                                            {option.description && (
                                                                <div className="text-sm text-gray-500">{option.description}</div>
                                                            )}
                                                        </div>
                                                    )}
                                                />
                                            </div>

                                            <div>
                                                <Label>Model (Std)</Label>
                                                <Select
                                                    options={plantModelOptions}
                                                    value={plantModelOptions.find((option) => option.value === data.alerts[index].model_id) || null}
                                                    onChange={(selectedOption) => updateAlert(index, 'model_id', selectedOption?.value || '')}
                                                    placeholder="Select a plant model..."
                                                    isClearable
                                                    isSearchable
                                                    styles={selectStyles}
                                                    formatOptionLabel={(option: any) => (
                                                        <div>
                                                            <div className="font-medium">{option.label}</div>
                                                            {option.description && (
                                                                <div className="text-sm text-gray-500">{option.description}</div>
                                                            )}
                                                        </div>
                                                    )}
                                                />
                                            </div>

                                            <div>
                                                <Label>Hazards</Label>
                                                <Select
                                                    isMulti
                                                    options={hazardOptions}
                                                    value={hazardOptions.filter((option) => data.alerts[index].hazard_ids?.includes(option.value))}
                                                    onChange={(selectedOptions) => {
                                                        const values = selectedOptions?.map((option) => option.value) || [];
                                                        updateAlert(index, 'hazard_ids', values);
                                                    }}
                                                    placeholder="Select hazards..."
                                                    isClearable
                                                    isSearchable
                                                    styles={selectStyles}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            );
                        })}
                    </form>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}