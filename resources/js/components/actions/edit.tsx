import React, { useEffect } from "react"
import { useForm } from "@inertiajs/react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ComboBoxList } from "../ui/combo-box"
import { PlantMake, PlantType } from "../ui/column"
import Swal from "sweetalert2"

interface EditActionDialogProps {
    children: React.ReactNode
    editData: any
    editUrl: string
    editTitle: string
    editDescription?: string
    open: boolean
    onOpenChange: (open: boolean) => void
    plantTypes?: PlantType[]
    plantMakes?: PlantMake[]
}

export default function EditActionDialog({
    children,
    editData,
    editUrl,
    editTitle,
    editDescription,
    open,
    onOpenChange,
    plantTypes = [],
    plantMakes = [],
}: EditActionDialogProps) {

    const { data, setData, put, processing, errors, reset } = useForm({
        section: editData?.section || "",
        name: editData?.name || "",
        type_id: editData?.type_id || "",
        make_id: editData?.make_id || "",
        model_id: editData?.model_id || "",
        description: editData.description || "",
        is_active: editData.is_active || true as boolean,
    });

    useEffect(() => {
        if (open) {
            setData({
                section: editData.section || "",
                name: editData.name || "",
                type_id: editData.type_id || "",
                make_id: editData.make_id || "",
                model_id: editData.model_id || "",
                description: editData.description || "",
                is_active: editData.is_active || true,
            });
        }
    }, [open, editData]);

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
        // Perform the update operation
        put(route(editUrl, editData.id), {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
                reset();
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

    const plantTypesOptions = plantTypes.map((type) => ({
        value: type.id,
        label: type.name,
        description: type.description,
        disabled: !type.is_active,
    })) || [];

    const plantMakesOptions = plantMakes.map((make) => ({
        value: make.id,
        label: make.name,
        description: make.description,
        disabled: !make.is_active,
    })) || [];

    const showPlantTypeCombobox = editData?.plant_type !== undefined || editData?.type_id !== undefined;
    const showPlantMakeCombobox = editData?.plant_make !== undefined || editData?.make_id !== undefined;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            {children}
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit {editTitle}</DialogTitle>
                    <DialogDescription>Update the {editDescription} details below.</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="grid gap-4 py-4">
                        {/* Show plant types if plant makes is viewed */}
                        {showPlantTypeCombobox && plantTypesOptions.length > 0 && (
                            <div className="grid gap-2">
                                <Label htmlFor="type_id">
                                    Plant Type <span className="text-red-500">*</span>
                                </Label>
                                <ComboBoxList
                                    data={plantTypesOptions}
                                    value={data.type_id}
                                    onValueChange={(value) => setData('type_id', value)}
                                    placeholder="Select a plant type..."
                                    searchPlaceholder="Search plant types..."
                                    emptyMessage="No plant types found."
                                    error={!!errors.type_id}
                                    displayField="label"
                                    width="w-full"
                                />
                                {editData?.plant_type && (
                                    <Input
                                        type="text"
                                        value={plantTypesOptions.find((option) => option.value === data.type_id)?.description || ""}
                                        readOnly
                                        className="bg-gray-100"
                                        title={plantTypesOptions.find((option) => option.value === data.type_id)?.description || "No description available"}
                                    />
                                )}
                                {errors.type_id && (
                                    <p className="text-red-500 text-sm mt-1">{errors.type_id}</p>
                                )}
                            </div>
                        )}
                        {/* Show plant makes if plant models is viewed */}
                        {showPlantMakeCombobox && !showPlantTypeCombobox && plantMakesOptions.length > 0 && (
                            <div className="grid gap-2">
                                <Label htmlFor="make_id">
                                    Plant Make <span className="text-red-500">*</span>
                                </Label>
                                <ComboBoxList
                                    data={plantMakesOptions}
                                    value={data.make_id}
                                    onValueChange={(value) => setData('make_id', value)}
                                    placeholder="Select a plant make..."
                                    searchPlaceholder="Search plant makes..."
                                    emptyMessage="No plant makes found."
                                    error={!!errors.make_id}
                                    displayField="label"
                                    width="w-full"
                                />
                                {editData?.plant_make && (
                                    <Input
                                        type="text"
                                        value={plantMakesOptions.find((option) => option.value === data.make_id)?.description || ""}
                                        readOnly
                                        className="bg-gray-100"
                                        title={plantMakesOptions.find((option) => option.value === data.make_id)?.description || "No description available"}
                                    />
                                )}
                                {errors.make_id && (
                                    <p className="text-red-500 text-sm mt-1">{errors.make_id}</p>
                                )}
                            </div>
                        )}
                        {/* Name/Section */}
                        <div className="grid gap-2">
                            <Label htmlFor={`${editDescription}`}>
                                {editTitle} <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id={`${editDescription}`}
                                value={data.section ? data.section : data.name}
                                onChange={(e) => setData(data.section ? 'section' : 'name', e.target.value)}
                                placeholder={`Enter ${editDescription} section`}
                                className={errors.section ? errors.section && 'border-red-500' : errors.name && 'border-red-500'}
                            />
                            {errors.section ? errors.section && (
                                <p className="text-red-500 text-sm mt-1">{errors.section}</p>
                            ) : (
                                errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                )
                            )}
                        </div>
                        {/* Description */}
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Enter regulation description (optional)"
                                className={errors.description ? "border-red-500" : ""}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                            )}
                        </div>
                        {/* Is Active */}
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="is_active"
                                checked={data.is_active}
                                onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                            />
                            <Label
                                htmlFor="is_active"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Active
                            </Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant='outline'
                            onClick={() => handleOpenChange(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}