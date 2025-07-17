import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/column-alerts"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { router } from "@inertiajs/react"
import { Trash2 } from "lucide-react"
import Swal from "sweetalert2"

interface BulkDeleteAlertsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    selectedAlerts: Alert[]
    onDeleteComplete: () => void
}

export default function BulkDeleteAlertsDialog({
    open,
    onOpenChange,
    selectedAlerts,
    onDeleteComplete,
}: BulkDeleteAlertsDialogProps) {

    const handleBulkDelete = () => {
        onOpenChange(false);
        setTimeout(() => {
            Swal.fire({
                title: 'Are you absolutely sure?',
                html: `
                <p>This will permanently delete <strong>${selectedAlerts.length}</strong> alert(s).</p>
                <p class="text-red-600 font-medium">This action cannot be undone!</p>
            `,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc2626',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Yes, delete them!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    // Show loading
                    Swal.fire({
                        title: 'Deleting...',
                        html: 'Please wait while we delete the selected alerts',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        showConfirmButton: false,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });
                    // Perform the delete operation
                    const ids = selectedAlerts.map((alert) => alert.id);
                    router.delete(route('alerts.bulk-delete'), {
                        data: { ids },
                        onSuccess: () => {
                            onDeleteComplete();
                            onOpenChange(false);
                        },
                        onError: (errors) => {
                            console.error('Delete errors: ', errors);
                            Swal.fire({
                                title: 'Error',
                                text: 'An error occured while deleting the alerts. Please try again.',
                                icon: 'error',
                            });
                        }
                    });
                }
            });
        }, 100)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <Trash2 className="h-5 w-5" />
                        Delete Multiple Alerts
                    </DialogTitle>
                    <DialogDescription>
                        You are about to delete {selectedAlerts.length} alert(s). Please review the list below.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="bg-red-50 border boder-red-200 rounded-md p-4">
                        <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
                            <Trash2 className="h-4 w-4" />
                            Warning
                        </div>
                        <p className="text-red-700 text-sm">
                            This action will permanently delete all selected alerts. This cannot be undone.
                        </p>
                    </div>

                    <div className="border rounded-md">
                        <div className="bg-gray-50 px-4 py-2 border-b font-medium text-sm">
                            Selected Alerts ({selectedAlerts.length})
                        </div>
                        <div className="max-h-full">
                            {selectedAlerts.map((alert, index) => (
                                <div key={alert.id} className="px-4 py-3 border-b last:border-b-0 hover:bg-gray-50">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="outline" className="text-xs">
                                                    Item #{index + 1}
                                                </Badge>
                                                <span className="font-medium text-sm">
                                                    {alert.number}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600 truncate max-w-[400px]" title={alert.description}>
                                                {alert.description}
                                            </p>
                                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                                {alert.source && (
                                                    <span>Source: {alert.source.name}</span>
                                                )}
                                                <span>
                                                    Date: {new Date(alert.created_at).toLocaleDateString('en-AU')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleBulkDelete}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete {selectedAlerts.length} Alert(s)
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}