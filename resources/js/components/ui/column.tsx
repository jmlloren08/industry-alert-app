import { ColumnDef } from "@tanstack/react-table"
import { Button } from "./button"
import { ArrowUpDown } from "lucide-react"

export type Alert = {
    id: string
    number: string
    source?: {
        name: string
    }
    incident_date: string
    description: string
    hyperlink_text?: string
    hyperlink_url?: string
    regulation?: {
        section: string
        description: string
    }
    organization?: {
        name: string
    }
    site?: {
        name: string
    }
    plant_type?: {
        name: string
    }
    plant_make?: {
        name: string
    }
    plant_model?: {
        name: string
    }
    hazards?: string
}

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
    created_at: string
    updated_at: string
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
    id: string
    plant_type_id: string
    name: string
    description?: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export type PlantModel = {
    id: string
    plant_make_id: string
    name: string
    description?: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export const alertColumns: ColumnDef<Alert>[] = [
    {
        accessorKey: "number",
        header: "Number",
    },
    {
        accessorKey: "source.name",
        header: "Source",
        cell: ({ row }) => {
            return row.original.source?.name || "N/A"
        },
    },
    {
        accessorKey: "incident_date",
        header: "Incident Date",
        cell: ({ row }) => {
            return new Date(row.original.incident_date).toLocaleDateString()
        },
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
            return (
                <div className="max-w-[300px] truncate">
                    {row.original.description}
                </div>
            )
        },
    },
    {
        accessorKey: "hyperlink_text",
        header: "Hyperlink Text",
    },
    {
        accessorKey: "hyperlink_url",
        header: "Hyperlink URL",
        cell: ({ row }) => {
            return row.original.hyperlink_url || "N/A"
        },
    },
    {
        accessorKey: "regulation.section",
        header: "Reg Section",
        cell: ({ row }) => {
            return row.original.regulation?.section || "N/A"
        },
    },
    {
        accessorKey: "regulation.description",
        header: "Reg Description",
        cell: ({ row }) => {
            return row.original.regulation?.description || "N/A"
        },
    },
    {
        accessorKey: "organization.name",
        header: "Organization",
        cell: ({ row }) => {
            return row.original.organization?.name || "N/A"
        },
    },
    {
        accessorKey: "site.name",
        header: "Site",
        cell: ({ row }) => {
            return row.original.site?.name || "N/A"
        },
    },
    {
        accessorKey: "plant_type.name",
        header: "Plant Type",
        cell: ({ row }) => {
            return row.original.plant_type?.name || "N/A"
        },
    },
    {
        accessorKey: "plant_make.name",
        header: "Plant Make",
        cell: ({ row }) => {
            return row.original.plant_make?.name || "N/A"
        },
    },
    {
        accessorKey: "plant_model.name",
        header: "Plant Model",
        cell: ({ row }) => {
            return row.original.plant_model?.name || "N/A"
        },
    },
    {
        accessorKey: "hazards",
        header: "Hazards",
        cell: ({ row }) => {
            return (
                <div className="max-w-[200px] truncate">
                    {row.original.hazards || "N/A"}
                </div>
            )
        },
    },
];

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
                    className="max-w-[300px] truncate"
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
                <div className="max-w-[300px] truncate">
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
                <div className="max-w-[300px] truncate">
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
];

export const plantTypeColumns: ColumnDef<PlantType>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
            return (
                <div className="max-w-[300px] truncate">
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
];

export const plantMakeColumns: ColumnDef<PlantMake>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
            return (
                <div className="max-w-[300px] truncate">
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
];

export const plantModelColumns: ColumnDef<PlantModel>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
            return (
                <div className="max-w-[300px] truncate">
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
];