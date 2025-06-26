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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlantType } from "@/components/ui/column"

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
        plant_type_id: "",
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

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
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
                            <Label htmlFor="plant_type_id">
                                Plant Type <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={data.plant_type_id}
                                onValueChange={(value) => setData('plant_type_id', value)}
                            >
                                <SelectTrigger className={errors.plant_type_id ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Select plant type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {plantTypes?.filter(type => type.is_active).map((type) => (
                                        <SelectItem key={type.id} value={type.id}>
                                            {type.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.plant_type_id && (
                                <p className="text-sm text-red-500">{errors.plant_type_id}</p>
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
                                placeholder={!data.plant_type_id ? "Select a plant type first" : "Enter make name"}
                                className={errors.name ? "border-red-500" : ""}
                                disabled={!data.plant_type_id}
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
        </Dialog>
    );
}
