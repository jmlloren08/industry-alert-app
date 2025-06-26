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
import { organizationColumns, Organization } from "../../components/ui/column"
import { DataTable } from "../../components/ui/data-table"
import { Button } from "@/components/ui/button"
import CreateOrganizationDialog from "./create"
import useFlashMessages from "@/hooks/use-flash-messages"

interface PaginatedOrganizations {
    data: Organization[]
    current_page: number
    last_page: number
    per_page: number
    total: number
}

export default function Index({ organizations }: { organizations: PaginatedOrganizations }) {
    
    useFlashMessages();
    // Extract the data array from the paginated response
    const data: Organization[] = organizations?.data || []

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
                                        <BreadcrumbPage>Organizations</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
                            <CreateOrganizationDialog>
                                <Button className="mb-2">Add new item</Button>
                            </CreateOrganizationDialog>
                            <DataTable columns={organizationColumns} data={data} />
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}
