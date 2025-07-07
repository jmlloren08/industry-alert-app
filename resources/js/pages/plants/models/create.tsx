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
import { PlantMake } from "@/components/ui/column"
import { ComboBoxList } from "@/components/ui/combo-box"

interface CreateModelDialogProps {
    children: React.ReactNode
    plantMakes: PlantMake[]
}

export default function CreateModelDialog({
    children,
    plantMakes,
}: CreateModelDialogProps) {

    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        make_id: "",
        name: "",
        description: "",
        is_active: true as boolean,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('plant-models.store'), {
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

    const plantMakesOptions = plantMakes.map((make) => ({
        value: make.id,
        label: make.name,
        description: make.description,
        disabled: !make.is_active,
    })) || [];

    return (
        <Dialog open={open} onOpenChange={handleOpenChange} modal={false}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Plant Model</DialogTitle>
                    <DialogDescription>
                        Add a new plant model to the system. Fill in the details below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="grid gap-4 py-4">
                        {/* Plant Make Dropdown */}
                        <div className="grid gap-2">
                            <Label htmlFor="make_id">
                                Plant Make <span className="text-red-500">*</span>
                            </Label>
                            <ComboBoxList
                                data={plantMakesOptions}
                                value={data.make_id}
                                onValueChange={(value) => setData('make_id', value)}
                                placeholder="Select plant make"
                                searchPlaceholder="Search plant makes..."
                                emptyMessage="No plant makes found."
                                error={!!errors.make_id}
                                displayField="label"
                                width="w-full"
                            />
                            {data.make_id && (
                                <Input
                                    type="text"
                                    value={plantMakesOptions.find((option) => option.value === data.make_id)?.description || ""}
                                    readOnly
                                    className="bg-gray-100"
                                    title={plantMakesOptions.find((option) => option.value === data.make_id)?.description || "No description available"}
                                />
                            )}
                            {errors.make_id && (
                                <p className="text-sm text-red-500">{errors.make_id}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="name">
                                Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Enter model name"
                                className={errors.name ? "border-red-500" : ""}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Enter model description (optional)"
                                className={errors.description ? "border-red-500" : ""}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">{errors.description}</p>
                            )}
                        </div>
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
                            {processing ? "Creating..." : "Create Plant Model"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
