import { ColumnDef, FilterFn } from "@tanstack/react-table"
import ColumnActionsAlerts from "../actions/column-actions-alerts"
import { Badge } from "./badge"
import { Source, Organization, Site, PlantMake, PlantModel, PlantType, } from "./column"
import { AlertTriangle, Check, CheckCheck } from "lucide-react"
import { Checkbox } from "./checkbox"
import { ColumnHeaderFilter } from "./column-header-filter"

export type Alert = {
    id: string
    number: string
    source?: Source
    incident_date: string
    description: string
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

    is_new: boolean
    is_reviewed: boolean
    reviewed_by?: string
    reviewed_at?: Date
    reviewer?: {
        id: string
        name: string
        email: string
    }

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

const arrayIncludesFilter: FilterFn<Alert> = (row, columnId, value) => {
    if (columnId === 'regulations') {
        const regulations = row.original?.regulations || [];
        return regulations.some((regulation) => regulation.section === value);
    }
    if (columnId === 'hazards') {
        const hazards = row.original?.hazards || [];
        return hazards.some((hazard) => hazard.name === value);
    }
    return false;
}

const statusFilter: FilterFn<Alert> = (row, columnId, value) => {
    const alert = row.original;
    const hasMissingData = !alert.regulations?.length || !alert.hazards?.length;

    switch (value) {
        case 'new':
            return alert.is_new;
        case 'reviewed':
            return alert.is_reviewed && !hasMissingData;
        case 'complete':
            return !alert.is_reviewed && !hasMissingData;
        case 'incomplete':
            return hasMissingData;
        default:
            return true;
    }
}
export const CreateAlertColumns = (
    enableSelection: boolean = false,
    filterOptions: Record<string, any> = {},
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
                    />
                );
            },
        }
    );

    // Other columns
    columns.push(
        {
            accessorKey: "number",
            header: ({ column }) => (
                <ColumnHeaderFilter
                    column={column}
                    title="Number"
                    filterOptions={filterOptions['number'] || []}
                />
            ),
        },
        {
            accessorKey: "source.name",
            header: ({ column }) => (
                <ColumnHeaderFilter
                    column={column}
                    title="Source"
                    filterOptions={filterOptions['source.name'] || []}
                />
            ),
            cell: ({ row }) => {
                return row.original.source?.name || (
                    <Badge variant='secondary'>No source provided</Badge>
                )
            },
        },
        {
            accessorKey: "incident_date",
            header: ({ column }) => (
                <ColumnHeaderFilter
                    column={column}
                    title="Incident Date"
                    filterOptions={filterOptions['incident_date'] || []}
                />
            ),
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
            header: ({ column }) => (
                <ColumnHeaderFilter
                    column={column}
                    title="Regulations"
                    filterOptions={filterOptions['regulations'] || []}
                />
            ),
            filterFn: arrayIncludesFilter,
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
            header: ({ column }) => (
                <ColumnHeaderFilter
                    column={column}
                    title="Organization"
                    filterOptions={filterOptions['organization.name'] || []}
                />
            ),
            cell: ({ row }) => {
                return row.original.organization?.name || (
                    <Badge variant='secondary'>No organization provided</Badge >
                )
            },
        },
        {
            accessorKey: "site.name",
            header: ({ column }) => (
                <ColumnHeaderFilter
                    column={column}
                    title="Site"
                    filterOptions={filterOptions['site.name'] || []}
                />
            ),
            cell: ({ row }) => {
                return row.original.site?.name || (
                    <Badge variant='secondary'>No site provided</Badge >
                )
            },
        },
        {
            accessorKey: "plant_type.name",
            header: ({ column }) => (
                <ColumnHeaderFilter
                    column={column}
                    title="Equipment"
                    filterOptions={filterOptions['plant_type.name'] || []}
                />
            ),
            cell: ({ row }) => {
                return row.original.plant_type?.name || (
                    <Badge variant='secondary'>No types provided</Badge >
                )
            },
        },
        {
            accessorKey: "plant_make.name",
            header: ({ column }) => (
                <ColumnHeaderFilter
                    column={column}
                    title="Make"
                    filterOptions={filterOptions['plant_make.name'] || []}
                />
            ),
            cell: ({ row }) => {
                return row.original.plant_make?.name || (
                    <Badge variant='secondary'>No makes provided</Badge >
                )
            },
        },
        {
            accessorKey: "plant_model.name",
            header: ({ column }) => (
                <ColumnHeaderFilter
                    column={column}
                    title="Model"
                    filterOptions={filterOptions['plant_model.name'] || []}
                />
            ),
            cell: ({ row }) => {
                return row.original.plant_model?.name || (
                    <Badge variant='secondary'>No models provided</Badge >
                )
            },
        },
        {
            accessorKey: "hazards",
            header: ({ column }) => (
                <ColumnHeaderFilter
                    column={column}
                    title="Hazards"
                    filterOptions={filterOptions['hazards'] || []}
                />
            ),
            filterFn: arrayIncludesFilter,
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
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <ColumnHeaderFilter
                    column={column}
                    title="Status"
                    filterOptions={filterOptions['status'] || []}
                />
            ),
            filterFn: statusFilter,
            cell: ({ row }) => {
                const alert = row.original;
                const hasMissingData = !alert.regulations?.length || !alert.hazards?.length;
                return (
                    <div className="flex items-center gap-1">
                        {alert.is_reviewed && !hasMissingData && (
                            <div className="flex items-center text-xs text-green-600" title="Vetted">
                                <CheckCheck />
                            </div>
                        )}
                        {!alert.is_reviewed && !hasMissingData && (
                            <div className="flex items-center text-xs text-green-600" title="Data complete">
                                <Check />
                            </div>
                        )}
                        {hasMissingData && (
                            <div className="flex items-center text-xs text-amber-600" title="Missing data">
                                <AlertTriangle />
                            </div>
                        )}
                    </div>
                );
            },
        },
    );

    return columns;
};