import { Badge } from "../ui/badge";
import { Alert } from "../ui/column-alerts";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";

interface ShowAlertsDialogProps {
    data: Alert
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function ShowAlertsDialog({
    data,
    open,
    onOpenChange,
}: ShowAlertsDialogProps) {

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full">
                <DialogHeader>
                    <DialogTitle>Alert Details</DialogTitle>
                    <DialogDescription>View alert information</DialogDescription>
                </DialogHeader>
                <div className="w-full space-y-4">
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium text-gray-500">Number</Label>
                            <p className="mt-1">{data.number}</p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-500">Source</Label>
                            <p className="mt-1">{data.source?.name || "N/A"}</p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-500">Incident Date</Label>
                            <p className="mt-1">{new Date(data.incident_date).toLocaleDateString('en-AU')}</p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-500">Description</Label>
                            <p className="mt-1">{data.description || "No description provided"}</p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-500">Hyperlink URL</Label>
                            <p className="mt-1">
                                {data.hyperlink_url ? (
                                    <a href={data.hyperlink_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                                        {data.description || "View Link"}
                                    </a>
                                ) : "No URL provided"}
                            </p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-500">Regulations</Label>
                            {data.regulations && data.regulations.length > 0 ? (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {data.regulations.map((regulation) => (
                                        <Badge
                                            key={regulation.id}
                                            variant="default"
                                            className="truncate"
                                            title={`${regulation.section} - ${regulation.description || "No regulations provided"}`}
                                        >
                                            {regulation.section || "No regulations provided"}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-1">No regulations associated</p>
                            )}
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-500">Organization</Label>
                            <p className="mt-1">{data.organization?.name || "N/A"}</p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-500">Site</Label>
                            <p className="mt-1">{data.site?.name || "N/A"}</p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-500">Plant Type</Label>
                            <p className="mt-1">{data.plant_type?.name || "N/A"}</p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-500">Plant Make</Label>
                            <p className="mt-1">{data.plant_make?.name || "N/A"}</p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-500">Plant Model</Label>
                            <p className="mt-1">{data.plant_model?.name || "N/A"}</p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-500">Hazards</Label>
                            {data.hazards && data.hazards.length > 0 ? (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {data.hazards.map((hazard) => (
                                        <Badge
                                            key={hazard.id}
                                            variant="default"
                                            className="truncate"
                                            title={`${hazard.name} - ${hazard.description || "No hazards provided"}`}
                                        >
                                            {hazard.name || "No hazards provided"}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-1">No hazards associated</p>
                            )}
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-500">Created At</Label>
                            <p className="mt-1">{new Date(data.created_at).toLocaleString()}</p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-500">Updated At</Label>
                            <p className="mt-1">{new Date(data.updated_at).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}