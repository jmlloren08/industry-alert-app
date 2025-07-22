import { CircleCheck } from "lucide-react";
import { Button } from "../ui/button";
import { Alert, Hazard, Regulation } from "../ui/column-alerts";
import React from "react";
import { Organization, PlantMake, PlantModel, PlantType, Site, Source } from "../ui/column";
import { toast } from "sonner";
import axios from "axios";
import { router } from "@inertiajs/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface ColumnActionsAlertsProps {
    data: Alert
}

export default function ColumnActionsAlerts({
    data,
}: ColumnActionsAlertsProps) {

    const [isMarkingReviewed, setIsMarkingReviewed] = React.useState(false);
    const [isMarkingNew, setIsMarkingNew] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleMarkAsReviewedOrNew = async () => {

        if (data.is_reviewed) {
            setIsMarkingNew(true);
            setLoading(true);
            try {
                const response = await axios.patch(route('alerts.mark-new', data.id));
                const result = await response.data;
                if (result.success) {
                    toast.success(result.message || "Alert marked as new successfully.");
                    router.reload({ only: ['alerts'] });
                } else {
                    toast.error(result.message || "Failed to mark alert as new.");
                }
            } catch (error) {
                console.error('Error marking alert as new: ', error);
                toast.error("Failed to mark alert as new.");
            } finally {
                setIsMarkingNew(false);
                setLoading(false);
            }
            return;
        }

        setIsMarkingReviewed(true);
        setLoading(true);

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
            setLoading(false);
        }
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
                            className={`h-8 w-8 p-0 ${data.is_reviewed ? 'text-green-600' : 'text-gray-400'}`}
                            onClick={handleMarkAsReviewedOrNew}
                            disabled={isMarkingReviewed || isMarkingNew}
                        >
                            {loading ? (
                                <span className="relative flex size-3">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                                    <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
                                </span>
                            ) : (
                                <CircleCheck className={`h-4 w-4 ${data.is_reviewed ? 'text-green-600' : ''}`} />
                            )}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="shadow-sm">
                        {data.is_reviewed ? (
                            <div className="text-xs">
                                <p>Alert entry reviewed by {data.reviewer?.name} on {data.reviewed_at && new Date(data.reviewed_at).toLocaleDateString('en-AU')}. <br />Click to mark as new</p>
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