import { useState } from "react"
import { useForm } from "@inertiajs/react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { PlantType } from "@/components/ui/column"
import { ComboBoxList } from "@/components/ui/combo-box"

interface CreateMakeDialogProps {
    children: React.ReactNode
    plantTypes: PlantType[]
}

export default function CreateMakeDialog({
    children,
    plantTypes,
}: CreateMakeDialogProps) {

    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        type_id: "",
        name: "",
        description: "",
        is_active: true as boolean,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('plant-makes.store'), {
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

    const plantTypesOptions = plantTypes.map((type) => ({
        value: type.id,
        label: type.name,
        description: type.description,
        disabled: !type.is_active,
    })) || [];

    return (
        <Dialog open={open} onOpenChange={handleOpenChange} modal={false}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Plant Make</DialogTitle>
                    <DialogDescription>
                        Add a new plant make to the system. Fill in the details below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="grid gap-4 py-4">
                        {/* Plant Type Dropdown */}
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
                            {data.type_id && (
                                <Input
                                    type="text"
                                    value={plantTypesOptions.find((option) => option.value === data.type_id)?.description || ""}
                                    readOnly
                                    className="bg-gray-100"
                                    title={plantTypesOptions.find((option) => option.value === data.type_id)?.description || "No description available"}
                                />
                            )}
                            {errors.type_id && (
                                <p className="text-sm text-red-500">{errors.type_id}</p>
                            )}
                        </div>
                        {/* Make Name */}
                        <div className="grid gap-2">
                            <Label htmlFor="name">
                                Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder={!data.type_id ? "Select a plant type first" : "Enter make name"}
                                className={errors.name ? "border-red-500" : ""}
                                disabled={!data.type_id}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>
                        {/* Make Description */}
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Enter make description (optional)"
                                className={errors.description ? "border-red-500" : ""}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">{errors.description}</p>
                            )}
                        </div>
                        {/* Active Checkbox */}
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
                            {processing ? "Creating..." : "Create Plant Make"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    );
}
