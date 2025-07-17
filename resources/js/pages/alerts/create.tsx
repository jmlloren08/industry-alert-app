import React, { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Organization, PlantMake, PlantModel, PlantType, Site, Source } from "@/components/ui/column";
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
import { Hazard, Regulation } from "@/components/ui/column-alerts";
import Swal from "sweetalert2";

interface CreateAlertDialogProps {
    children: React.ReactNode,
    sources?: Source[],
    regulations?: Regulation[],
    organizations?: Organization[],
    sites?: Site[],
    plantTypes?: PlantType[],
    plantMakes?: PlantMake[],
    plantModels?: PlantModel[],
    hazards?: Hazard[],
}

export default function CreateAlertDialog({
    children,
    sources = [],
    regulations = [],
    organizations = [],
    sites = [],
    plantTypes = [],
    plantMakes = [],
    plantModels = [],
    hazards = [],
}: CreateAlertDialogProps) {

    const [open, setOpen] = useState(false);
    const [availablePlantMakes, setAvailablePlantMakes] = useState<PlantMake[]>([]);
    const [availablePlantModels, setAvailablePlantModels] = useState<PlantModel[]>([]);
    const [incidentDate, setIncidentDate] = useState<Date | null | undefined>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
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
    })) || [];

    useEffect(() => {
        if (data.type_id) {
            const filteredMakes = plantMakes.filter((make) => make.type_id === data.type_id);
            setAvailablePlantMakes(filteredMakes);
            setData((prev) => ({ ...prev, make_id: "", model_id: "" }));
            setAvailablePlantModels([]);
        } else {
            setAvailablePlantMakes([]);
            setAvailablePlantModels([]);
        }
    }, [data.type_id]);

    useEffect(() => {
        if (data.make_id) {
            const filteredModels = plantModels.filter((model) => model.make_id === data.make_id);
            setAvailablePlantModels(filteredModels);
            setData((prev) => ({ ...prev, model_id: "" }));
        } else {
            setAvailablePlantModels([]);
        }
    }, [data.make_id]);

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
        // Post the form data
        post(route('alerts.store'), {
            onSuccess: () => {
                reset();
                setIncidentDate(undefined);
                setOpen(false);
                setAvailablePlantMakes([]);
                setAvailablePlantModels([]);
            },
        });
    }

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            reset();
            setIncidentDate(undefined);
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
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Alert</DialogTitle>
                    <DialogDescription>
                        Add a new alert to the system. Fill in the details below.
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
                                tabIndex={1}
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
                                value={sourceOptions.find((option) => option.value === data.source_id) || null}
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
                                tabIndex={3}
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
                                tabIndex={4}
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
                            <Label htmlFor="organization_id">Organization</Label>
                            <Select
                                options={organizationOptions}
                                value={organizationOptions.find((option) => option.value === data.organization_id) || null}
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
                            <Label htmlFor="site_id">Site</Label>
                            <Select
                                options={siteOptions}
                                value={siteOptions.find((option) => option.value === data.site_id) || null}
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
                            <Label htmlFor="type_id">Equipment (Std)</Label>
                            <Select
                                options={plantTypeOptions}
                                value={plantTypeOptions.find((option) => option.value === data.type_id) || null}
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
                            <Label htmlFor="make_id">Make (Std)</Label>
                            <Select
                                options={plantMakeOptions}
                                value={plantMakeOptions.find((option) => option.value === data.make_id) || null}
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
                            <Label htmlFor="model_id">Model (Std)</Label>
                            <Select
                                options={plantModelOptions}
                                value={plantModelOptions.find((option) => option.value === data.model_id) || null}
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
                            <Label htmlFor="hazards">Hazards</Label>
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
                                formatOptionLabel={(option: any) => (
                                    <div className="font-medium">{option.label}</div>
                                )}
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
                            onClick={() => setOpen(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? "Creating..." : "Create Alert"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}