import { useForm } from "@inertiajs/react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { AlertTriangle, Trash2 } from "lucide-react"
import { Button } from "../ui/button"

interface DeleteAlertsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description: string
    deleteUrl: string
    itemName?: string
    itemDescription?: string
}

export default function DeleteAlertsDialog({
    open,
    onOpenChange,
    title,
    description,
    deleteUrl,
    itemName,
    itemDescription,
}: DeleteAlertsDialogProps) {

    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(deleteUrl, {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <DialogTitle className="text-red-600">{title}</DialogTitle>
                    </div>
                    <DialogDescription className="flex flex-col">
                        {description}
                        {itemName && itemDescription && (
                            <>
                                <span className="font-medium text-foreground mt-2">
                                    {itemName}
                                </span>
                                <span className="font-medium text-foreground">
                                    {itemDescription}
                                </span>
                            </>
                        )}
                        <br />
                        <span className="text-red-600 font-medium">
                            This action cannot be undone.
                        </span>
                    </DialogDescription>
                </DialogHeader>
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
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={processing}
                    >
                        {processing ? "Deleting..." : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};