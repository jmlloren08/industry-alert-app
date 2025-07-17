import { AlertTriangle, Check, CheckCircle, CircleCheck, DeleteIcon, EditIcon, EyeIcon, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Alert, Hazard, Regulation } from "../ui/column-alerts";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import React from "react";
import ShowAlertsDialog from "./show-alerts";
import EditAlertsDialog from "./edit-alerts";
import DeleteAlertsDialog from "./delete-alerts";
import { Organization, PlantMake, PlantModel, PlantType, Site, Source } from "../ui/column";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import axios from "axios";
import { router } from "@inertiajs/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface ColumnActionsAlertsProps {
    data: Alert
    editUrl: string
    deleteUrl: string
    dialogTitle: string
    dialogDescription: string
    sources?: Source[]
    regulations?: Regulation[]
    organizations?: Organization[]
    sites?: Site[]
    plantTypes?: PlantType[]
    plantMakes?: PlantMake[]
    plantModels?: PlantModel[]
    hazards?: Hazard[]
}

export default function ColumnActionsAlerts({
    data,
    editUrl,
    deleteUrl,
    dialogTitle,
    dialogDescription,
    sources = [],
    regulations = [],
    organizations = [],
    sites = [],
    plantTypes = [],
    plantMakes = [],
    plantModels = [],
    hazards = [],
}: ColumnActionsAlertsProps) {

    const [showDialog, setShowDialog] = React.useState(false);
    const [editDialog, setEditDialog] = React.useState(false);
    const [deleteDialog, setDeleteDialog] = React.useState(false);
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    const [isMarkingReviewed, setIsMarkingReviewed] = React.useState(false);

    const handleMarkAsReviewed = async () => {
        if (data.is_reviewed) {
            toast.info("Alert is already marked as reviewed.");
            return
        }

        setIsMarkingReviewed(true);

        try {
            const response = await axios.patch(route('alerts.mark-reviewed', data.id));
            const result = await response.data;
            if (result.success) {
                toast.success(result.message || "Alert marked as reviewed successfully.");
                router.reload({ only: ['alerts'] });
            } else {
                toast.error(result.message || "Failed to mark alert as reviewed.");
            }
        } catch (error) {
            console.error('Error marking alert as reviewed: ', error);
            toast.error("Failed to mark alert as reviewed.");
        } finally {
            setIsMarkingReviewed(false);
        }
    }

    const hasMissingData = !data.regulations?.length || !data.hazards?.length

    const handleViewClick = () => {
        setDropdownOpen(false);
        setTimeout(() => setShowDialog(true), 100);
    }

    const handleEditClick = () => {
        setDropdownOpen(false);
        setTimeout(() => setEditDialog(true), 100);
    }

    const handleDeleteClick = () => {
        setDropdownOpen(false);
        setTimeout(() => setDeleteDialog(true), 100);
    }

    return (
        <div className="flex items-center gap-2">
            {/* Review Status Check Icon */}
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 p-0 ${data.is_reviewed ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-600'}`}
                            onClick={handleMarkAsReviewed}
                            disabled={isMarkingReviewed}
                        >
                            <CircleCheck className={`h-4 w-4 ${data.is_reviewed ? 'bg-gree-600 text-green-600' : ''}`} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="shadow-sm">
                        {data.is_reviewed ? (
                            <div className="text-xs">
                                <p>Alert entry reviewed by {data.reviewer?.name} on {data.reviewed_at && new Date(data.reviewed_at).toLocaleDateString('en-AU')}</p>
                            </div>
                        ) : (
                            <p className="text-xs">Click to mark as reviewed</p>
                        )}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div >
    );
};