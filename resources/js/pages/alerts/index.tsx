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
import { Head } from "@inertiajs/react"
import { Source, Organization, Site, PlantType, PlantMake, PlantModel, Regulation } from "../../components/ui/column"
import { DataTable } from "../../components/ui/data-table"
import CreateAlertDialog from "./create"
import { Button } from "@/components/ui/button"
import useFlashMessages from "@/hooks/use-flash-messages"
import { Alert, CreateAlertColumns } from "@/components/ui/column-alerts"
import { Plus } from "lucide-react"

export default function Index({
  alerts,
  sources = [],
  regulations = [],
  organizations = [],
  sites = [],
  plantTypes = [],
  plantMakes = [],
  plantModels = [],
}: {
  alerts: Alert[],
  sources: Source[],
  regulations: Regulation[],
  organizations: Organization[],
  sites: Site[],
  plantTypes: PlantType[],
  plantMakes: PlantMake[],
  plantModels: PlantModel[],
}) {

  useFlashMessages();

  const alertColumns = CreateAlertColumns(
    sources,
    regulations,
    organizations,
    sites,
    plantTypes,
    plantMakes,
    plantModels
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
    { header: "Hazards", accessor: "hazards" },
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
            <div className="min-h-[100vh] flex-1 md:min-h-min">
              <CreateAlertDialog
                sources={sources}
                regulations={regulations}
                organizations={organizations}
                sites={sites}
                plantTypes={plantTypes}
                plantMakes={plantMakes}
                plantModels={plantModels}
              >
                <Button className="mt-2">
                  <Plus />
                  Add new item
                </Button>
              </CreateAlertDialog>
              <DataTable
                columns={alertColumns}
                data={alerts}
                filterValue1="number"
                filterValue2="description"
                exportColumns={alertExportColumns}
                exportFilename={`${new Date().toLocaleString()}-alerts-export`}
                exportTitle="Industry Alert Report"
              />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
