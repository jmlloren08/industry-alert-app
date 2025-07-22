import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Head, router } from "@inertiajs/react"
import { Source, Organization, Site, PlantType, PlantMake, PlantModel } from "../../components/ui/column"
import { DataTable } from "../../components/ui/data-table"
import CreateAlertDialog from "./create"
import { Button } from "@/components/ui/button"
import useFlashMessages from "@/hooks/use-flash-messages"
import { Alert, CreateAlertColumns, Hazard, Regulation } from "@/components/ui/column-alerts"
import { AlertTriangle, BellPlus, CheckCircle, Edit, Plus, Trash2 } from "lucide-react"
import React from "react"
import BulkDeleteAlertsDialog from "./bulk-delete"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function Index({
  alerts,
  sources = [],
  regulations = [],
  organizations = [],
  sites = [],
  plantTypes = [],
  plantMakes = [],
  plantModels = [],
  hazards = [],
}: {
  alerts: Alert[],
  sources: Source[],
  regulations: Regulation[],
  organizations: Organization[],
  sites: Site[],
  plantTypes: PlantType[],
  plantMakes: PlantMake[],
  plantModels: PlantModel[],
  hazards: Hazard[],
}) {

  useFlashMessages();

  const [selectedRows, setSelectedRows] = React.useState<Alert[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false);
  const [showNewOnly, setShowNewOnly] = React.useState(false);

  // Sort alerts to ensure newest/most recently updated are at the top
  const sortedAlerts = React.useMemo(() => {
    return [...alerts].sort((a, b) => {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }, [alerts]);

  // Filters alerts based on the toggle
  const filteredAlerts = React.useMemo(() => {
    if (showNewOnly) {
      return sortedAlerts.filter((alert) => alert.is_new);
    }
    return alerts;
  }, [alerts, showNewOnly]);

  // Calculate metrics
  const newAlertsCount = filteredAlerts.filter((alert) => alert.is_new).length;
  const reviewedAlertsCount = filteredAlerts.filter((alert) => alert.is_reviewed).length;
  const incompleteDataCount = filteredAlerts.filter((alert) => !alert.regulations?.length || !alert.hazards?.length).length;

  const handleToggleNewOnly = (checked: boolean) => {
    setShowNewOnly(checked);
  }

  const handleBulkEdit = () => {
    if (selectedRows.length > 0) {
      const selectedIds = selectedRows.map((alert) => alert.id)
      router.visit(route('alerts.bulk-edit'), {
        data: { ids: selectedIds },
      });
    }
  }

  const handleBulkDelete = () => {
    if (selectedRows.length > 0) {
      setBulkDeleteOpen(true);
    }
  }

  const handleDeleteComplete = () => {
    setSelectedRows([]);
  }

  const customActions = (
    <div className="flex gap-2">
      {selectedRows.length > 0 && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkEdit}
          >
            <Edit />
            Edit Selected ({selectedRows.length})
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
          >
            <Trash2 />
            Delete Selected ({selectedRows.length})
          </Button>
        </>
      )}
      <CreateAlertDialog
        sources={sources}
        regulations={regulations}
        organizations={organizations}
        sites={sites}
        plantTypes={plantTypes}
        plantMakes={plantMakes}
        plantModels={plantModels}
        hazards={hazards}
      >
        <Button size="sm">
          <Plus />
          Add new item
        </Button>
      </CreateAlertDialog>
    </div >
  );

  // Filter options
  const filterOptions = React.useMemo(() => {
    return {
      'source.name': sources.map((source) => ({
        label: source.name,
        value: source.name,
      })),
      'regulations': regulations.map((regulation) => ({
        label: regulation.section,
        value: regulation.section,
      })),
      'organization.name': organizations.map((organization) => ({
        label: organization.name,
        value: organization.name,
      })),
      'site.name': sites.map((site) => ({
        label: site.name,
        value: site.name,
      })),
      'plant_type.name': plantTypes.map((type) => ({
        label: type.name,
        value: type.name,
      })),
      'plant_make.name': [...new Set(plantMakes.map((make) => make.name))].map((name) => ({
        label: name,
        value: name,
      })),
      'plant_model.name': [...new Set(plantModels.map((model) => model.name))].map((name) => ({
        label: name,
        value: name,
      })),
      'hazards': hazards.map((hazard) => ({
        label: hazard.name,
        value: hazard.name,
      })),
      'status': [
        { label: 'New', value: 'new' },
        { label: 'Reviewed (Complete)', value: 'reviewed' },
        { label: 'Complete (Not Reviewed)', value: 'complete' },
        { label: 'Incomplete', value: 'incomplete' },
      ],
    }
  }, [sources, regulations, organizations, sites, plantTypes, plantMakes, plantModels, hazards]);

  const alertColumns = CreateAlertColumns(
    true,
    filterOptions,
  );

  const alertExportColumns = [
    { header: "Number", accessor: "number" },
    { header: "Source", accessor: "source.name" },
    {
      header: "Incident Date",
      accessor: "incident_date",
      cell: (value: string) => new Date(value).toLocaleDateString(),
    },
    { header: "Description", accessor: "description" },
    { header: "Hyperlink", accessor: "hyperlink_url" },
    {
      header: "Regulation",
      accessor: "regulations",
      cell: (regulations: Regulation[]) => regulations?.map((regulation) => `${regulation.section} - ${regulation.description}`).join("; ") || "No regulations provided",
    },
    { header: "Organization", accessor: "organization.name" },
    { header: "Site", accessor: "site.name" },
    { header: "Plant Type", accessor: "plant_type.name" },
    { header: "Plant Make", accessor: "plant_make.name" },
    { header: "Plant Model", accessor: "plant_model.name" },
    {
      header: "Hazard",
      accessor: "hazards",
      cell: (hazards: Hazard[]) => hazards?.map((hazard) => `${hazard.name}`).join("; ") || "No hazards provided",
    },
    {
      header: 'Review Status',
      accessor: 'is_reviewed',
      cell: (value: boolean) => value ? 'Reviewed' : 'Not Reviewed',
    },
  ];

  return (
    <>
      <Head title="Alerts" />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Alerts</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {/* Review Metrics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">

              <div className="bg-red-50 p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">New Alerts</p>
                    <p className="text-2xl font-bold text-red-900">{newAlertsCount}</p>
                  </div>
                  <BellPlus className="text-red-500" />
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Reviewed Alerts</p>
                    <p className="text-2xl font-bold text-green-900">{reviewedAlertsCount}</p>
                  </div>
                  <CheckCircle className="text-green-500" />
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-600">Incomplete Data</p>
                    <p className="text-2xl font-bold text-amber-900">{incompleteDataCount}</p>
                  </div>
                  <AlertTriangle className="text-amber-500" />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Alerts</p>
                    <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters Controls */}
            <div className="flex items-center space-x-2">
              <Switch
                id="show-new-only"
                checked={showNewOnly}
                onCheckedChange={handleToggleNewOnly}
              />
              {showNewOnly ? (
                <Label htmlFor="show-new-only">Show all</Label>
              ) : (
                <Label htmlFor="show-new-only">Show new alerts only</Label>
              )}
            </div>
            <div>
              <DataTable
                columns={alertColumns}
                data={filteredAlerts}
                filterValue1="number"
                filterValue2="description"
                exportColumns={alertExportColumns}
                exportFilename={`${new Date().toLocaleString()}-alerts-export`}
                exportTitle="Industry Alert Report"
                enableRowSelection={true}
                onRowSelectionChange={setSelectedRows}
                customActions={customActions}
              />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider >

      {/* Bulk Delete Dialog */}
      < BulkDeleteAlertsDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        selectedAlerts={selectedRows}
        onDeleteComplete={handleDeleteComplete}
      />
    </>
  );
}
