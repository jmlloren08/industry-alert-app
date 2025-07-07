import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface ShowActionDialogProps {
    children: React.ReactNode
    showData: any
    dialogTitle: string
    dialogDescription?: string
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function ShowActionDialog({
    children,
    showData,
    dialogTitle,
    dialogDescription,
    open,
    onOpenChange,
}: ShowActionDialogProps) {

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {children}
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{dialogTitle} Details</DialogTitle>
                    <DialogDescription>View {dialogDescription} information</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* Show plant types if plant makes is viewed */}
                    {showData.plant_type && (
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm text-gray-500">Plant Type</h4>
                            <Badge variant="secondary">{showData.plant_type.name}</Badge>
                            <p className="text-xs text-gray-500">{showData.plant_type.description || "No description available"}</p>
                        </div>
                    )}
                    {/* Show plant makes if plant models is viewed */}
                    {showData.plant_make && (
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm text-gray-500">Plant Make</h4>
                            <Badge variant="secondary">{showData.plant_make.name}</Badge>
                            <p className="text-xs text-gray-500">{showData.plant_make.description || "No description available"}</p>
                        </div>
                    )}
                    {/* Section */}
                    <div className="space-y-2">
                        <h4 className="font-medium text-sm text-gray-500">{showData.section ? "Section" : "Name"}</h4>
                        <p>{showData.section || showData.name}</p>
                    </div>
                    {/* Description */}
                    <div className="space-y-2">
                        <h4 className="font-medium text-sm text-gray-500">Description</h4>
                        <p className="text-sm">{showData.description || "No description provided"}</p>
                    </div>
                    {/* Is Active */}
                    <div className="space-y-2">
                        <h4 className="font-medium text-sm text-gray-500">Status</h4>
                        <Badge
                            variant={showData.is_active ? "default" : "secondary"}
                        >
                            {showData.is_active ? "Active" : "Inactive"}
                        </Badge>
                    </div>
                    {/* Timestamps */}
                    <div className="space-y-2">
                        <h4 className="font-medium text-sm text-gray-500">Created At</h4>
                        <p className="text-sm">{new Date(showData.created_at).toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-medium text-sm text-gray-500">Last Updated</h4>
                        <p className="text-sm">{new Date(showData.updated_at).toLocaleString()}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}