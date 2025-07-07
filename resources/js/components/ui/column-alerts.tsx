import { ColumnDef } from "@tanstack/react-table"
import ColumnActionsAlerts from "../actions/column-actions-alerts"
import { Badge } from "./badge"
import { Organization, PlantMake, PlantModel, PlantType, Site, Source } from "./column"

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
    regulation_ids?: string[]
    regulations?: Regulation[]
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

export const CreateAlertColumns = (
    sources: Source[] = [],
    regulations: Regulation[] = [],
    organizations: Organization[] = [],
    sites: Site[] = [],
    plantTypes: PlantType[] = [],
    plantMakes: PlantMake[] = [],
    plantModels: PlantModel[] = [],
): ColumnDef<Alert>[] => [
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
                    />
                );
            },
        },
        {
            accessorKey: "number",
            header: "Number",
        },
        {
            accessorKey: "source.name",
            header: "Source",
            cell: ({ row }) => {
                return row.original.source?.name || (
                    <Badge variant='secondary'>No source provided</Badge>
                )
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
            header: "Organization",
            cell: ({ row }) => {
                return row.original.organization?.name || (
                    <Badge variant='secondary'>No organization provided</Badge >
                )
            },
        },
        {
            accessorKey: "site.name",
            header: "Site",
            cell: ({ row }) => {
                return row.original.site?.name || (
                    <Badge variant='secondary'>No site provided</Badge >
                )
            },
        },
        {
            accessorKey: "plant_type.name",
            header: "Types",
            cell: ({ row }) => {
                return row.original.plant_type?.name || (
                    <Badge variant='secondary'>No types provided</Badge >
                )
            },
        },
        {
            accessorKey: "plant_make.name",
            header: "Makes",
            cell: ({ row }) => {
                return row.original.plant_make?.name || (
                    <Badge variant='secondary'>No makes provided</Badge >
                )
            },
        },
        {
            accessorKey: "plant_model.name",
            header: "Models",
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
                return (
                    <div
                        className="max-w-[200px] truncate"
                        title={row.original.hazards}
                    >
                        {row.original.hazards || (
                            <Badge variant='secondary'>No hazards provided</Badge>
                        )}
                    </div>
                )
            },
        },
    ];