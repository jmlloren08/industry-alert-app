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
import { alertColumns, Alert, Source, Organization, Site, PlantType, PlantMake, PlantModel, Regulation } from "../../components/ui/column"
import { DataTable } from "../../components/ui/data-table"
import CreateAlertDialog from "./create"
import { Button } from "@/components/ui/button"
import useFlashMessages from "@/hooks/use-flash-messages"

interface PaginatedAlerts {
  data: Alert[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

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
  alerts: PaginatedAlerts,
  sources: Source[],
  regulations: Regulation[],
  organizations: Organization[],
  sites: Site[],
  plantTypes: PlantType[],
  plantMakes: PlantMake[],
  plantModels: PlantModel[],
}) {

  useFlashMessages();
  // Extract the data array from the paginated response
  const data: Alert[] = alerts?.data || []

  return (
    <>
      <Head title="Dashboard" />
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
            <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
              <CreateAlertDialog
                sources={sources}
                regulations={regulations}
                organizations={organizations}
                sites={sites}
                plantTypes={plantTypes}
                plantMakes={plantMakes}
                plantModels={plantModels}
              >
                <Button className="mb-2">Add new item</Button>
              </CreateAlertDialog>
              <DataTable columns={alertColumns} data={data} />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
