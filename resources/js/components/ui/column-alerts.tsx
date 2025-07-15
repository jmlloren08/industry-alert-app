import { ColumnDef } from "@tanstack/react-table"
import ColumnActionsAlerts from "../actions/column-actions-alerts"
import { Badge } from "./badge"
import { Organization, PlantMake, PlantModel, PlantType, Site, Source } from "./column"
import { Button } from "./button"
import { ArrowUpDown } from "lucide-react"
import { Checkbox } from "./checkbox"

export type Alert = {
    id: string
    number: string
    source?: Source
    incident_date: string
    description: string
    hyperlink_text?: string
    hyperlink_url?: string

    regulation_ids?: string[]
    regulations?: Regulation[]

    organization?: Organization
    site?: Site
    plant_type?: PlantType
    plant_make?: PlantMake
    plant_model?: PlantModel

    hazard_ids?: string[]
    hazards?: Hazard[]

    created_at: Date
    updated_at: Date
}

export type Regulation = {
    id: string
    section: string
    description?: string
    is_active: boolean
    created_at: Date
    updated_at: Date
}

export type Hazard = {
    id: string
    name: string
    description?: string
    is_active: boolean
    created_at: Date
    updated_at: Date
}

export const CreateAlertColumns = (
    sources: Source[] = [],
    regulations: Regulation[] = [],
    organizations: Organization[] = [],
    sites: Site[] = [],
    plantTypes: PlantType[] = [],
    plantMakes: PlantMake[] = [],
    plantModels: PlantModel[] = [],
    hazards: Hazard[] = [],
    enableSelection: boolean = false,
): ColumnDef<Alert>[] => {

    const columns: ColumnDef<Alert>[] = [];

    // Add selection column if enabled
    if (enableSelection) {
        columns.push(
            {
                id: "select",
                header: ({ table }) => (
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            }
        );
    }
    // Action column
    columns.push(
        {
            id: "actions",
            cell: ({ row }) => {
                const alert = row.original;
                return (
                    <ColumnActionsAlerts
                        data={alert}
                        editUrl="alerts.update"
                        deleteUrl="alerts.destroy"
                        dialogTitle="Alert"
                        dialogDescription="alert"
                        sources={sources}
                        regulations={regulations}
                        organizations={organizations}
                        sites={sites}
                        plantTypes={plantTypes}
                        plantMakes={plantMakes}
                        plantModels={plantModels}
                        hazards={hazards}
                    />
                );
            },
        }
    );

    // Other columns
    columns.push(
        {
            accessorKey: "number",
            header: ({ column }) => {
                return (
                    <Button
                        variant='ghost'
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Number
                        <ArrowUpDown />
                    </Button>
                );
            },
        },
        {
            accessorKey: "source.name",
            header: ({ column }) => {
                return (
                    <Button
                        variant='ghost'
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Source
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => {
                return row.original.source?.name || (
                    <Badge variant='secondary'>No source provided</Badge>
                )
            },
        },
        {
            accessorKey: "incident_date",
            header: ({ column }) => {
                return (
                    <Button
                        variant='ghost'
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Incident Date
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => {
                return new Date(row.original.incident_date).toLocaleDateString('en-AU')
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
                )
            },
        },
        {
            accessorKey: "hyperlink_url",
            header: "Hyperlink URL",
            cell: ({ row }) => {
                return (
                    <div
                        className="max-w-[300px] truncate"
                        title={row.original.description}
                    >
                        <a
                            href={row.original.hyperlink_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            {row.original.description || "View Link"}
                        </a>
                    </div>
                );
            },
        },
        {
            accessorKey: "regulations",
            header: "Regulations (Section - Description)",
            cell: ({ row }) => {
                const regulations = row.original.regulations || [];
                return (
                    <div className="flex flex-wrap gap-1">
                        {regulations.length > 0 ? (
                            regulations.map((regulation) => (
                                <Badge key={regulation.id} variant="default">
                                    {`${regulation.section} - ${regulation.description || (
                                        <Badge variant='secondary'>No regulations provided</Badge>
                                    )}`}
                                </Badge>
                            ))
                        ) : (
                            <Badge variant='secondary'>No regulations provided</Badge>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "organization.name",
            header: ({ column }) => {
                return (
                    <Button
                        variant='ghost'
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Organization
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => {
                return row.original.organization?.name || (
                    <Badge variant='secondary'>No organization provided</Badge >
                )
            },
        },
        {
            accessorKey: "site.name",
            header: ({ column }) => {
                return (
                    <Button
                        variant='ghost'
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Site
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => {
                return row.original.site?.name || (
                    <Badge variant='secondary'>No site provided</Badge >
                )
            },
        },
        {
            accessorKey: "plant_type.name",
            header: ({ column }) => {
                return (
                    <Button
                        variant='ghost'
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Equipment (Std)
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => {
                return row.original.plant_type?.name || (
                    <Badge variant='secondary'>No types provided</Badge >
                )
            },
        },
        {
            accessorKey: "plant_make.name",
            header: ({ column }) => {
                return (
                    <Button
                        variant='ghost'
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Make (Std)
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => {
                return row.original.plant_make?.name || (
                    <Badge variant='secondary'>No makes provided</Badge >
                )
            },
        },
        {
            accessorKey: "plant_model.name",
            header: ({ column }) => {
                return (
                    <Button
                        variant='ghost'
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Model (Std)
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => {
                return row.original.plant_model?.name || (
                    <Badge variant='secondary'>No models provided</Badge >
                )
            },
        },
        {
            accessorKey: "hazards",
            header: "Hazards",
            cell: ({ row }) => {
                const hazards = row.original.hazards || [];
                return (
                    <div className="flex flex-wrap gap-1">
                        {hazards.length > 0 ? (
                            hazards.map((hazard) => (
                                <Badge key={hazard.id} variant='default'>
                                    {`${hazard.name || (
                                        <Badge>No hazards provided</Badge>
                                    )}`}
                                </Badge>
                            ))
                        ) : (
                            <Badge variant='secondary'>No hazards provided</Badge>
                        )}
                    </div>
                )
            },
        }
    );
    return columns;
};