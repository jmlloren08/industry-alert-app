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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Organization, PlantMake, PlantModel, PlantType, Regulation, Site, Source } from "@/components/ui/column";

interface CreateAlertDialogProps {
    children: React.ReactNode,
    sources?: Source[],
    regulations?: Regulation[],
    organizations?: Organization[],
    sites?: Site[],
    plantTypes?: PlantType[],
    plantMakes?: PlantMake[],
    plantModels?: PlantModel[],
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
}: CreateAlertDialogProps) {

    const [open, setOpen] = useState(false);
    const [availablePlantMakes, setAvailablePlantMakes] = useState<PlantMake[]>([]);
    const [availablePlantModels, setAvailablePlantModels] = useState<PlantModel[]>([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        number: "",
        source_id: "",
        incident_date: "",
        description: "",
        hyperlink_text: "",
        hyperlink_url: "",
        regulation_id: "",
        organization_id: "",
        site_id: "",
        plant_type_id: "",
        plant_make_id: "",
        plant_model_id: "",
        hazards: "",
    });

    // Filter plant makes based on selected plant type
    useEffect(() => {
        if (data.plant_type_id) {
            // Filter plant makes that belong to the selected plant type
            const filteredMakes = plantMakes.filter(make =>
                make.plant_type_id === data.plant_type_id && make.is_active
            );
            setAvailablePlantMakes(filteredMakes);
        } else {
            setAvailablePlantMakes([]);
            setData('plant_make_id', '');
            setData('plant_model_id', '');
        }
    }, [data.plant_type_id, plantMakes]);

    // Filter plant models based on selected plant make
    useEffect(() => {
        if (data.plant_make_id) {
            // Filter plant models that belong to the selected plant make
            const filteredModels = plantModels.filter(model =>
                model.plant_make_id === data.plant_make_id && model.is_active
            );
            setAvailablePlantModels(filteredModels);
        } else {
            setAvailablePlantModels([]);
            setData('plant_model_id', '');
        }
    }, [data.plant_make_id, plantModels]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('alerts.store'), {
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    }

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            reset();
        }
    }

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
                            <Label htmlFor="source_id">Source <span className="text-red-500">*</span></Label>
                            <Select
                                value={data.source_id}
                                onValueChange={(source_id) => setData('source_id', source_id)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select source" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sources.map((source) => (
                                        <SelectItem value={source.id} key={source.id}>
                                            {source.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.source_id && (
                                <p className="text-sm text-red-500">{errors.source_id}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="incident_date">
                                Incident Date <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="incident_date"
                                type="date"
                                value={data.incident_date}
                                onChange={(e) => setData('incident_date', e.target.value)}
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
                            <Label htmlFor="hyperlink_text">Hyperlink Text</Label>
                            <Input
                                id="hyperlink_text"
                                value={data.hyperlink_text}
                                onChange={(e) => setData('hyperlink_text', e.target.value)}
                                placeholder="Enter hyperlink text"
                                className={errors.hyperlink_text ? "border-red-500" : ""}
                            />
                            {errors.hyperlink_text && (
                                <p className="text-sm text-red-500">{errors.hyperlink_text}</p>
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
                            <Label htmlFor="regulation_id">Regulation <span className="text-red-500">*</span></Label>
                            <Select
                                value={data.regulation_id}
                                onValueChange={(regulation_id) => setData('regulation_id', regulation_id)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Regulation" />
                                </SelectTrigger>
                                <SelectContent>
                                    {regulations.map((regulation) => (
                                        <SelectItem value={regulation.id} key={regulation.id}>
                                            {regulation.section} - {regulation.description}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.regulation_id && (
                                <p className="text-sm text-red-500">{errors.regulation_id}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="organization_id">Organization <span className="text-red-500">*</span></Label>
                            <Select
                                value={data.organization_id}
                                onValueChange={(organization_id) => setData('organization_id', organization_id)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select organization" />
                                </SelectTrigger>
                                <SelectContent>
                                    {organizations.map((org) => (
                                        <SelectItem value={org.id} key={org.id}>
                                            {org.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.organization_id && (
                                <p className="text-sm text-red-500">{errors.organization_id}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="site_id">Site <span className="text-red-500">*</span></Label>
                            <Select
                                value={data.site_id}
                                onValueChange={(site_id) => setData('site_id', site_id)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select site" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sites.map((site) => (
                                        <SelectItem value={site.id} key={site.id}>
                                            {site.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.site_id && (
                                <p className="text-sm text-red-500">{errors.site_id}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="plant_type_id">Plant Type <span className="text-red-500">*</span></Label>
                            <Select
                                value={data.plant_type_id}
                                onValueChange={(plant_type_id) => setData('plant_type_id', plant_type_id)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select plant type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {plantTypes.map((type) => (
                                        <SelectItem value={type.id} key={type.id}>
                                            {type.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.plant_type_id && (
                                <p className="text-sm text-red-500">{errors.plant_type_id}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="plant_make_id">Plant Make <span className="text-red-500">*</span></Label>
                            <Select
                                value={data.plant_make_id}
                                onValueChange={(plant_make_id) => setData('plant_make_id', plant_make_id)}
                                disabled={!data.plant_type_id}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={!data.plant_type_id ? "Select plant type first" : "Select plant make"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {availablePlantMakes.map((make) => (
                                        <SelectItem value={make.id} key={make.id}>
                                            {make.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.plant_make_id && (
                                <p className="text-sm text-red-500">{errors.plant_make_id}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="plant_model_id">Plant Model <span className="text-red-500">*</span></Label>
                            <Select
                                value={data.plant_model_id}
                                onValueChange={(plant_model_id) => setData('plant_model_id', plant_model_id)}
                                disabled={!data.plant_make_id}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={!data.plant_make_id ? "Select plant make first" : "Select plant model"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {availablePlantModels.map((model) => (
                                        <SelectItem value={model.id} key={model.id}>
                                            {model.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.plant_model_id && (
                                <p className="text-sm text-red-500">{errors.plant_model_id}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="hazards">Hazards <span className="text-red-500">*</span></Label>
                            <Textarea
                                id="hazards"
                                value={data.hazards}
                                onChange={(e) => setData('hazards', e.target.value)}
                                placeholder="Enter hazards"
                                className={errors.hazards ? "border-red-500" : ""}
                            />
                            {errors.hazards && (
                                <p className="text-sm text-red-500">{errors.hazards}</p>
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