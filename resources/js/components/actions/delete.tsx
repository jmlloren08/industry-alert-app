import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useForm } from "@inertiajs/react"
import { AlertTriangle } from "lucide-react"
import Swal from "sweetalert2"

interface DeleteConfirmationDialogProps {
    children: React.ReactNode
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description: string
    deleteUrl: string
    itemName?: string
    itemDescription?: string
}

export default function DeleteConfirmationDialog({
    children,
    open,
    onOpenChange,
    title,
    description,
    deleteUrl,
    itemName,
    itemDescription,
}: DeleteConfirmationDialogProps) {

    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
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
        // Perform the delete operation
        destroy(deleteUrl, {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {children}
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
}