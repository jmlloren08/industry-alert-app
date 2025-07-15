import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { hazardColumns } from "@/components/ui/column";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import useFlashMessages from "@/hooks/use-flash-messages";
import { Head } from "@inertiajs/react";
import CreateHazardDialog from "./create";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Hazard } from "@/components/ui/column-alerts";

export default function Index({ hazards }: { hazards: Hazard[] }) {

    useFlashMessages();

    return (
        <>
            <Head title="Hazards" />
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
                                        <BreadcrumbPage>Hazards</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        <div className="min-h-[100vh] flex-1 md:min-h-min">
                            <CreateHazardDialog>
                                <Button className="mt-2" size="sm">
                                    <Plus />
                                    Add new item
                                </Button>
                            </CreateHazardDialog>
                            <DataTable
                                columns={hazardColumns}
                                data={hazards}
                                filterValue1="name"
                                filterValue2="description"
                            />
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}