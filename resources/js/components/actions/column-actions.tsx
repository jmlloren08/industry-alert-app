import React from "react";
import { DeleteIcon, EditIcon, EyeIcon, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import DeleteConfirmationDialog from "./delete";
import ShowActionDialog from "../actions/show";
import { PlantMake, PlantType } from "../ui/column";
import EditActionDialog from "./edit";

export default function ColumnActions({
    data,
    editUrl,
    deleteUrl,
    dialogTitle,
    dialogDescription,
    plantTypes = [],
    plantMakes = [],
}: {
    data: any
    editUrl: string
    deleteUrl: string
    dialogTitle: string
    dialogDescription: string
    plantTypes?: PlantType[]
    plantMakes?: PlantMake[]
}) {

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
                    <Button variant='ghost' className="h-8 w-8 p-0">
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
                    <DropdownMenuItem onClick={handleEditClick} >
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
            </DropdownMenu >

            {/* Show Dialog */}
            <ShowActionDialog
                showData={data}
                dialogTitle={dialogTitle}
                dialogDescription={dialogDescription}
                open={showDialog}
                onOpenChange={setShowDialog}
            >
                <></>
            </ShowActionDialog >
            {/* Edit Dialog */}
            <EditActionDialog
                editData={data}
                editUrl={editUrl}
                editTitle={dialogTitle}
                editDescription={dialogDescription}
                open={editDialog}
                onOpenChange={setEditDialog}
                plantTypes={plantTypes}
                plantMakes={plantMakes}
            >
                <></>
            </EditActionDialog >
            {/* Delete Dialog */}
            <DeleteConfirmationDialog
                open={deleteDialog}
                onOpenChange={setDeleteDialog}
                title={`Delete ${dialogTitle}`}
                description={`Are you sure you want to delete this ${dialogDescription}? This action cannot be undone.`}
                deleteUrl={route(deleteUrl, data.id)}
                itemName={data.section || data.name || ""}
                itemDescription={data.description}
            >
                <></>
            </DeleteConfirmationDialog >
        </>
    );
}