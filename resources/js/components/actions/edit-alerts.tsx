import { router, useForm } from "@inertiajs/react"
import { Alert, Hazard, Regulation } from "../ui/column-alerts";
import React, { useEffect, useState } from "react";
import { Organization, PlantMake, PlantModel, PlantType, Site, Source } from "../ui/column";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Select from 'react-select';
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import Swal from "sweetalert2";

interface EditAlertsDialogProps {
    editUrl: string
    editData: any
    editTitle: string
    editDescription: string
    open: boolean
    onOpenChange: (open: boolean) => void
    sources?: Source[]
    regulations?: Regulation[]
    organizations?: Organization[]
    sites?: Site[]
    plantTypes?: PlantType[]
    plantMakes?: PlantMake[]
    plantModels?: PlantModel[]
    hazards?: Hazard[]
}

export default function EditAlertsDialog({
    editUrl,
    editData,
    editTitle,
    editDescription,
    open,
    onOpenChange,
    sources = [],
    regulations = [],
    organizations = [],
    sites = [],
    plantTypes = [],
    plantMakes = [],
    plantModels = [],
    hazards = [],
}: EditAlertsDialogProps) {

    const [availablePlantMakes, setAvailablePlantMakes] = useState<PlantMake[]>([]);
    const [availablePlantModels, setAvailablePlantModels] = useState<PlantModel[]>([]);

    const { data, setData, put, processing, errors, reset } = useForm({
        number: "",
        source_id: "",
        incident_date: "",
        description: "",
        hyperlink_url: "",
        regulation_ids: [] as string[],
        organization_id: "",
        site_id: "",
        type_id: "",
        make_id: "",
        model_id: "",
        hazard_ids: [] as string[],
    });

    useEffect(() => {
        if (open && editData) {

            const regulationIds = editData.regulations?.map((regulation: Regulation) => regulation.id) || [];
            const hazardIds = editData.hazards?.map((hazard: Hazard) => hazard.id) || [];

            setData({
                number: editData.number || "",
                source_id: editData.source?.id || "",
                incident_date: editData.incident_date || "",
                description: editData.description || "",
                hyperlink_url: editData.hyperlink_url || "",
                regulation_ids: regulationIds,
                organization_id: editData.organization?.id || "",
                site_id: editData.site?.id || "",
                type_id: editData.plant_type?.id || "",
                make_id: editData.plant_make?.id || "",
                model_id: editData.plant_model?.id || "",
                hazard_ids: hazardIds,
            });
        }
    }, [open, editData]);

    useEffect(() => {
        if (data.type_id) {
            const filterMakes = plantMakes.filter((make) => make.type_id === data.type_id);
            setAvailablePlantMakes(filterMakes);
            // Only reset make and model if they're not compatible with the current type
            const currentMakeValid = filterMakes.some((make) => make.id === data.make_id);
            if (!currentMakeValid) {
                setData((prev) => ({ ...prev, make_id: "", model_id: "" }));
                setAvailablePlantModels([]);
            }
        } else {
            setAvailablePlantMakes([]);
            setAvailablePlantModels([]);
        }
    }, [data.type_id]);

    useEffect(() => {
        if (data.make_id) {
            const filteredModels = plantModels.filter((model) => model.make_id === data.make_id);
            setAvailablePlantModels(filteredModels);
            // Only reset model if it's not compatible with the current make
            const currentModelValid = filteredModels.some((model) => model.id === data.model_id);
            if (!currentModelValid) {
                setData((prev) => ({ ...prev, model_id: "" }));
            }
        } else {
            setAvailablePlantModels([]);
        }
    }, [data.make_id]);

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

    const plantMakeOptions = availablePlantMakes.map((plantMake) => ({
        value: plantMake.id,
        label: plantMake.name,
        description: plantMake.description,
    })) || [];

    const plantModelOptions = availablePlantModels.map((plantModel) => ({
        value: plantModel.id,
        label: plantModel.name,
        description: plantModel.description,
    })) || [];

    const hazardOptions = hazards.map((hazard) => ({
        value: hazard.id,
        label: hazard.name,
        description: hazard.description,
    })) || [];

    const submit = (e: React.FormEvent) => {
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
        // Put the form data
        put(route(editUrl, editData.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onOpenChange(false);
            },
            onError: (error) => {
                console.error(`Failed to update ${editTitle}: `, error);
            }
        });
    }

    const handleOpenChange = (newOpen: boolean) => {
        onOpenChange(newOpen);
        if (!newOpen) {
            reset();
        }
    }

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

    const errorSelectStyles = {
        ...selectStyles,
        control: (base: any, state: any) => ({
            ...base,
            borderColor: '#ef4444',
            boxShadow: state.isFocused ? '0 0 0 1px #ef4444' : 'none',
            '&:hover': {
                borderColor: '#ef4444',
            },
        }),
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit {editTitle}</DialogTitle>
                    <DialogDescription>
                        Update the {editDescription} details below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="number">
                                Alert Number <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="number"
                                value={data.number}
                                onChange={(e) => setData('number', e.target.value)}
                                placeholder="Enter alert number"
                                className={errors.number ? "border-red-500" : ""}
                            />
                            {errors.number && (
                                <p className="text-sm text-red-500">{errors.number}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="source_id">
                                Source <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                options={sourceOptions}
                                value={sourceOptions.find(option => option.value === data.source_id) || null}
                                onChange={(selectedOption) => setData('source_id', selectedOption?.value || '')}
                                placeholder="Select source..."
                                isClearable
                                isSearchable
                                styles={errors.source_id ? errorSelectStyles : selectStyles}
                            />
                            {errors.source_id && (
                                <p className="text-sm text-red-500">{errors.source_id}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="incident_date">
                                Incident Date <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="date"
                                id="incident_date"
                                value={data.incident_date}
                                onChange={(e) => setData('incident_date', e.target.value)}
                                placeholder="Enter incident date"
                                className={errors.incident_date ? "border-red-500" : ""}
                            />
                            {errors.incident_date && (
                                <p className="text-sm text-red-500">{errors.incident_date}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Enter description"
                                className={errors.description ? "border-red-500" : ""}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">{errors.description}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="hyperlink_url">Hyperlink URL</Label>
                            <Input
                                id="hyperlink_url"
                                type="url"
                                value={data.hyperlink_url}
                                onChange={(e) => setData('hyperlink_url', e.target.value)}
                                placeholder="Enter hyperlink URL"
                                className={errors.hyperlink_url ? "border-red-500" : ""}
                            />
                            {errors.hyperlink_url && (
                                <p className="text-sm text-red-500">{errors.hyperlink_url}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="regulation_id">Regulation</Label>
                            <Select
                                isMulti
                                options={regulationOptions}
                                value={regulationOptions.filter((option) => data.regulation_ids.includes(option.value))}
                                onChange={(selectedOptions) => {
                                    const values = selectedOptions?.map(option => option.value) || [];
                                    setData('regulation_ids', values);
                                }}
                                placeholder="Select regulations..."
                                isClearable
                                isSearchable
                                styles={errors.regulation_ids ? errorSelectStyles : selectStyles}
                                formatOptionLabel={(option: any) => (
                                    <div className="font-medium">{option.label}</div>
                                )}
                            />
                            {errors.regulation_ids && (
                                <p className="text-sm text-red-500">{errors.regulation_ids}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="organization_id">Organization <span className="text-red-500">*</span></Label>
                            <Select
                                options={organizationOptions}
                                value={organizationOptions.find(option => option.value === data.organization_id) || null}
                                onChange={(selectedOption) => setData('organization_id', selectedOption?.value || '')}
                                placeholder="Select organization..."
                                isClearable
                                isSearchable
                                styles={errors.organization_id ? errorSelectStyles : selectStyles}
                            />
                            {errors.organization_id && (
                                <p className="text-sm text-red-500">{errors.organization_id}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="site_id">Site <span className="text-red-500">*</span></Label>
                            <Select
                                options={siteOptions}
                                value={siteOptions.find(option => option.value === data.site_id) || null}
                                onChange={(selectedOption) => setData('site_id', selectedOption?.value || '')}
                                placeholder="Select site..."
                                isClearable
                                isSearchable
                                styles={errors.site_id ? errorSelectStyles : selectStyles}
                            />
                            {errors.site_id && (
                                <p className="text-sm text-red-500">{errors.site_id}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="type_id">Plant Type <span className="text-red-500">*</span></Label>
                            <Select
                                options={plantTypeOptions}
                                value={plantTypeOptions.find(option => option.value === data.type_id) || null}
                                onChange={(selectedOption) => setData('type_id', selectedOption?.value || '')}
                                placeholder="Select plant type..."
                                isClearable
                                isSearchable
                                styles={errors.type_id ? errorSelectStyles : selectStyles}
                                formatOptionLabel={(option: any) => (
                                    <div>
                                        <div className="font-medium">{option.label}</div>
                                        {option.description && (
                                            <div className="text-sm text-gray-500">{option.description}</div>
                                        )}
                                    </div>
                                )}
                            />
                            {errors.type_id && (
                                <p className="text-sm text-red-500">{errors.type_id}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="make_id">Plant Make <span className="text-red-500">*</span></Label>
                            <Select
                                options={plantMakeOptions}
                                value={plantMakeOptions.find(option => option.value === data.make_id) || null}
                                onChange={(selectedOption) => setData('make_id', selectedOption?.value || '')}
                                placeholder="Select plant make..."
                                isClearable
                                isSearchable
                                styles={errors.make_id ? errorSelectStyles : selectStyles}
                                formatOptionLabel={(option: any) => (
                                    <div>
                                        <div className="font-medium">{option.label}</div>
                                        {option.description && (
                                            <div className="text-sm text-gray-500">{option.description}</div>
                                        )}
                                    </div>
                                )}
                            />
                            {errors.make_id && (
                                <p className="text-sm text-red-500">{errors.make_id}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="model_id">Plant Model <span className="text-red-500">*</span></Label>
                            <Select
                                options={plantModelOptions}
                                value={plantModelOptions.find(option => option.value === data.model_id) || null}
                                onChange={(selectedOption) => setData('model_id', selectedOption?.value || '')}
                                placeholder="Select plant model..."
                                isClearable
                                isSearchable
                                styles={errors.model_id ? errorSelectStyles : selectStyles}
                                formatOptionLabel={(option: any) => (
                                    <div>
                                        <div className="font-medium">{option.label}</div>
                                        {option.description && (
                                            <div className="text-sm text-gray-500">{option.description}</div>
                                        )}
                                    </div>
                                )}
                            />
                            {errors.model_id && (
                                <p className="text-sm text-red-500">{errors.model_id}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="hazards">Hazards <span className="text-red-500">*</span></Label>
                            <Select
                                isMulti
                                options={hazardOptions}
                                value={hazardOptions.filter((option) => data.hazard_ids.includes(option.value))}
                                onChange={(selectedOptions) => {
                                    const values = selectedOptions?.map((option) => option.value) || [];
                                    setData('hazard_ids', values);
                                }}
                                placeholder="Select hazards..."
                                isClearable
                                isSearchable
                                styles={errors.hazard_ids ? errorSelectStyles : selectStyles}
                            />
                            {errors.hazard_ids && (
                                <p className="text-sm text-red-500">{errors.hazard_ids}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? "Updating..." : "Update Alert"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}