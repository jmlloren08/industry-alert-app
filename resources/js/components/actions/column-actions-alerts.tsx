import { DeleteIcon, EditIcon, EyeIcon, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Alert } from "../ui/column-alerts";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import React from "react";
import ShowAlertsDialog from "./show-alerts";
import EditAlertsDialog from "./edit-alerts";
import DeleteAlertsDialog from "./delete-alerts";
import { Organization, PlantMake, PlantModel, PlantType, Regulation, Site, Source } from "../ui/column";

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
}: ColumnActionsAlertsProps) {

    const [showDialog, setShowDialog] = React.useState(false);
    const [editDialog, setEditDialog] = React.useState(false);
    const [deleteDialog, setDeleteDialog] = React.useState(false);
    const [dropdownOpen, setDropdownOpen] = React.useState(false);

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
        <>
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleViewClick}>
                        <EyeIcon />
                        View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleEditClick}>
                        <EditIcon />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={handleDeleteClick}
                        variant="destructive"
                    >
                        <DeleteIcon />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Show Dialog */}
            <ShowAlertsDialog
                open={showDialog}
                onOpenChange={setShowDialog}
                data={data}
            />
            {/* Edit Dialog */}
            <EditAlertsDialog
                editData={data}
                editUrl={editUrl}
                editTitle={dialogTitle}
                editDescription={dialogDescription}
                open={editDialog}
                onOpenChange={setEditDialog}
                sources={sources}
                regulations={regulations}
                organizations={organizations}
                sites={sites}
                plantTypes={plantTypes}
                plantMakes={plantMakes}
                plantModels={plantModels}
            />
            {/* Delete Dialog */}
            <DeleteAlertsDialog
                open={deleteDialog}
                onOpenChange={setDeleteDialog}
                title={`Delete ${dialogTitle}`}
                description={`Are you sure you want to delete this ${dialogDescription}? This action cannot be undone.`}
                deleteUrl={route(deleteUrl, data.id)}
                itemName={data.number}
                itemDescription={data.description}
            />
        </>
    );
};