import { ColumnDef } from "@tanstack/react-table"
import { Button } from "./button"
import { ArrowUpDown } from "lucide-react"
import ColumnActions from "../actions/column-actions"

export type Source = {
    id: string
    name: string
    description?: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export type Regulation = {
    id: string
    section: string
    description?: string
    is_active: boolean
    created_at: Date
    updated_at: Date
}

export type Organization = {
    id: string
    name: string
    description?: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export type Site = {
    id: string
    name: string
    description?: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export type PlantType = {
    id: string
    name: string
    description?: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export type PlantMake = {
    type_id: string
    id: string
    plant_type: PlantType
    name: string
    description?: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export type PlantModel = {
    make_id: string
    id: string
    plant_make: PlantMake
    name: string
    description?: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export const sourceColumns: ColumnDef<Source>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
            return (
                <div
                    className="max-w-[700px] truncate"
                    title={row.original.description}
                >
                    {row.original.description}
                </div>
            )
        },
    },
    {
        accessorKey: "is_active",
        header: "Active",
        cell: ({ row }) => {
            return row.original.is_active ? (
                <span className="px-2 py-0.5 bg-green-100 border-green-500 rounded-full text-green-500">Yes</span>
            ) : (
                <span className="px-2 py-0.5 bg-red-100 border-red-500 rounded-full text-red-500">No</span>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const source = row.original;
            return (
                <ColumnActions
                    data={source}
                    editUrl="sources.update"
                    deleteUrl="sources.destroy"
                    dialogTitle="Source"
                    dialogDescription="source"
                />
            );
        },
    },
];

export const regulationColumns: ColumnDef<Regulation>[] = [
    {
        accessorKey: "section",
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Section
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => {
            return row.original.section || "N/A"
        },
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
            return (
                <div
                    className="max-w-[700px] truncate"
                    title={row.original.description}
                >
                    {row.original.description}
                </div>
            );
        },
    },
    {
        accessorKey: "is_active",
        header: "Active",
        cell: ({ row }) => {
            return row.original.is_active ? (
                <span className="px-2 py-0.5 bg-green-100 border-green-500 rounded-full text-green-500">Yes</span>
            ) : (
                <span className="px-2 py-0.5 bg-red-100 border-red-500 rounded-full text-red-500">No</span>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const regulation = row.original;
            return (
                <ColumnActions
                    data={regulation}
                    editUrl="regulations.update"
                    deleteUrl="regulations.destroy"
                    dialogTitle="Regulation"
                    dialogDescription="regulation"
                />
            );
        },
    },
];

export const organizationColumns: ColumnDef<Organization>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
            return (
                <div
                    className="max-w-[700px] truncate"
                    title={row.original.description}
                >
                    {row.original.description}
                </div>
            )
        },
    },
    {
        accessorKey: "is_active",
        header: "Active",
        cell: ({ row }) => {
            return row.original.is_active ? (
                <span className="px-2 py-0.5 bg-green-100 border-green-500 rounded-full text-green-500">Yes</span>
            ) : (
                <span className="px-2 py-0.5 bg-red-100 border-red-500 rounded-full text-red-500">No</span>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const organization = row.original;
            return (
                <ColumnActions
                    data={organization}
                    editUrl="organizations.update"
                    deleteUrl="organizations.destroy"
                    dialogTitle="Organization"
                    dialogDescription="organization"
                />
            );
        },
    },
];

export const siteColumns: ColumnDef<Site>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
            return (
                <div
                    className="max-w-[700px] truncate"
                    title={row.original.description}
                >
                    {row.original.description}
                </div>
            )
        },
    },
    {
        accessorKey: "is_active",
        header: "Active",
        cell: ({ row }) => {
            return row.original.is_active ? (
                <span className="px-2 py-0.5 bg-green-100 border-green-500 rounded-full text-green-500">Yes</span>
            ) : (
                <span className="px-2 py-0.5 bg-red-100 border-red-500 rounded-full text-red-500">No</span>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const site = row.original;
            return (
                <ColumnActions
                    data={site}
                    editUrl="sites.update"
                    deleteUrl="sites.destroy"
                    dialogTitle="Site"
                    dialogDescription="site"
                />
            );
        },
    },
];

export const plantTypeColumns: ColumnDef<PlantType>[] = [
    {
        accessorKey: "name",
        header: "Type",
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
            return (
                <div
                    className="max-w-[700px] truncate"
                    title={row.original.description}
                >
                    {row.original.description}
                </div>
            )
        },
    },
    {
        accessorKey: "is_active",
        header: "Active",
        cell: ({ row }) => {
            return row.original.is_active ? (
                <span className="px-2 py-0.5 bg-green-100 border-green-500 rounded-full text-green-500">Yes</span>
            ) : (
                <span className="px-2 py-0.5 bg-red-100 border-red-500 rounded-full text-red-500">No</span>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const plantType = row.original;
            return (
                <ColumnActions
                    data={plantType}
                    editUrl="plant-types.update"
                    deleteUrl="plant-types.destroy"
                    dialogTitle="Plant Type"
                    dialogDescription="plant type"
                />
            );
        },
    },
];

export const createPlantMakeColumns = (plantTypes: PlantType[] = []): ColumnDef<PlantMake>[] => [
    {
        accessorKey: "plant_type.name",
        header: "Type",
        cell: ({ row }) => {
            return row.original.plant_type?.name || "N/A"
        },
    },
    {
        accessorKey: "name",
        header: "Make",
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
            return (
                <div
                    className="max-w-[700px] truncate"
                    title={row.original.description}
                >
                    {row.original.description}
                </div>
            )
        },
    },
    {
        accessorKey: "is_active",
        header: "Active",
        cell: ({ row }) => {
            return row.original.is_active ? (
                <span className="px-2 py-0.5 bg-green-100 border-green-500 rounded-full text-green-500">Yes</span>
            ) : (
                <span className="px-2 py-0.5 bg-red-100 border-red-500 rounded-full text-red-500">No</span>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const plantMake = row.original;
            return (
                <ColumnActions
                    data={plantMake}
                    editUrl="plant-makes.update"
                    deleteUrl="plant-makes.destroy"
                    dialogTitle="Plant Make"
                    dialogDescription="plant make"
                    plantTypes={plantTypes}
                />
            );
        },
    },
];

export const createPlantModelColumns = (plantMakes: PlantMake[] = []): ColumnDef<PlantModel>[] => [
    {
        accessorKey: "plant_make.name",
        header: "Make",
        cell: ({ row }) => {
            return row.original.plant_make?.name || "N/A"
        },
    },
    {
        accessorKey: "name",
        header: "Model",
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
            return (
                <div
                    className="max-w-[700px] truncate"
                    title={row.original.description}
                >
                    {row.original.description}
                </div>
            )
        },
    },
    {
        accessorKey: "is_active",
        header: "Active",
        cell: ({ row }) => {
            return row.original.is_active ? (
                <span className="px-2 py-0.5 bg-green-100 border-green-500 rounded-full text-green-500">Yes</span>
            ) : (
                <span className="px-2 py-0.5 bg-red-100 border-red-500 rounded-full text-red-500">No</span>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const plantModel = row.original;
            return (
                <ColumnActions
                    data={plantModel}
                    editUrl="plant-models.update"
                    deleteUrl="plant-models.destroy"
                    dialogTitle="Plant Model"
                    dialogDescription="plant model"
                    plantMakes={plantMakes}
                />
            );
        },
    },
];