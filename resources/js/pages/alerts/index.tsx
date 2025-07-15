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
import { Edit, Plus } from "lucide-react"
import React from "react"
import BulkEditAlertsDialog from "./bulk-edit"

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
  const [bulkEditOpen, setBulkEditOpen] = React.useState(false);

  const alertColumns = CreateAlertColumns(
    sources,
    regulations,
    organizations,
    sites,
    plantTypes,
    plantMakes,
    plantModels,
    hazards,
    true,
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
  ];

  const handleBulkEdit = () => {
    if (selectedRows.length > 0) {
      const selectedIds = selectedRows.map((alert) => alert.id)
      router.visit(route('alerts.bulk-edit'), {
        data: { ids: selectedIds },
      });
    }
  }

  const customActions = (
    <div className="flex gap-2">
      {selectedRows.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleBulkEdit}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Selected ({selectedRows.length})
        </Button>
      )}
      <CreateAlertDialog
        sources={sources}
        regulations={regulations}
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
            <div className="min-h-[100vh] flex-1 md:min-h-min">
              <DataTable
                columns={alertColumns}
                data={alerts}
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
      </SidebarProvider>
    </>
  );
}
