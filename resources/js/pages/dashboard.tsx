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
import { AlertByCategory, DashboardMetrics, RecentAlert } from "@/types"
import { Head } from "@inertiajs/react"
import React, { useEffect } from "react"
import axios from "axios"
import { KPIBlock } from "@/components/dashboard/kpi-block"
import { AreaChartComponent } from "@/components/dashboard/area-charts"
import { FiltersSidebar } from "@/components/dashboard/filters-sidebar"
import { RecentAlerts } from "@/components/dashboard/recent-alerts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChartComponent } from "@/components/dashboard/pie-chart"
import { BarChartComponent } from "@/components/dashboard/bar-chart"
import { count } from "console"

export default function Dashboard() {

  const [loading, setLoading] = React.useState(true);
  const [metrics, setMetrics] = React.useState<DashboardMetrics>();
  const [chartData, setChartData] = React.useState({
    labels: [],
    values: [],
  });
  const [recentAlerts, setRecentAlerts] = React.useState<RecentAlert[]>([]);
  const [alertsBySource, setAlertsBySource] = React.useState<AlertByCategory[]>([]);
  const [alertsByRegulation, setAlertsByRegulation] = React.useState<AlertByCategory[]>([]);
  const [alertsByOrganization, setAlertsByOrganization] = React.useState<AlertByCategory[]>([]);
  const [alertsBySite, setAlertsBySite] = React.useState<AlertByCategory[]>([]);
  const [alertsByHazard, setAlertsByHazard] = React.useState<AlertByCategory[]>([]);
  const [alertsByPlantType, setAlertsByPlantType] = React.useState<AlertByCategory[]>([]);

  const fetchDashboardData = async (filters = {}) => {
    try {
      setLoading(true);

      if (Object.keys(filters).length > 0) {
        // Fetch filtered data
        const response = await axios.get('/auth/verified/dashboard/filtered-data', { params: filters });
        const data = response.data;

        setMetrics(data.metrics);
        setRecentAlerts(data.alerts.slice(0, 10));

        // Update chart data with filtered data
        const alerts = data.alerts;

        // Update alerts over time chart
        const timeData = alerts.reduce((acc: any, alert: any) => {
          const month = new Date(alert.incident_date).toLocaleDateString('en-AU').slice(0, 7);
          const existing = acc.find((item: any) => item.month === month);
          if (existing) {
            existing.count++;
          } else {
            acc.push({ month, count: 1 });
          }
          return acc;
        }, [] as any[]).sort((a: any, b: any) => a.month.localeCompare(b.month));

        setChartData({
          labels: timeData.map((item: any) => item.month),
          values: timeData.map((item: any) => item.count),
        });

        // Update alerts by sources
        const sourceData = alerts.reduce((acc: AlertByCategory[], alert: any) => {
          if (alert.source?.name) {
            const existing = acc.find((item) => item.name == alert.source.name);
            if (existing) {
              existing.count++;
            } else {
              acc.push({ name: alert.source.name, count: 1 });
            }
          }
          return acc;
        }, [] as AlertByCategory[]).sort((a: AlertByCategory, b: AlertByCategory) => b.count - a.count).slice(0, 10);

        setAlertsBySource(sourceData);

        // Update alerts by regulation
        const regulationData = alerts.reduce((acc: AlertByCategory[], alert: any) => {
          alert.regulations?.forEach((regulation: any) => {
            if (regulation.section) {
              const existing = acc.find((item) => item.name === regulation.section);
              if (existing) {
                existing.count++;
              } else {
                acc.push({ name: regulation.section, count: 1 });
              }
            }
          });
          return acc;
        }, [] as AlertByCategory[]).sort((a: AlertByCategory, b: AlertByCategory) => b.count - a.count).slice(0, 10);

        setAlertsByRegulation(regulationData);

        // Update alerts by organization
        const organizationData = alerts.reduce((acc: AlertByCategory[], alert: any) => {
          if (alert.organization?.name) {
            const existing = acc.find((item) => item.name === alert.organization.name);
            if (existing) {
              existing.count++;
            } else {
              acc.push({ name: alert.organization.name, count: 1 });
            }
          }
          return acc;
        }, [] as AlertByCategory[]).sort((a: AlertByCategory, b: AlertByCategory) => b.count - a.count).slice(0, 10);

        setAlertsByOrganization(organizationData);

        // Update alerts by site
        const siteData = alerts.reduce((acc: AlertByCategory[], alert: any) => {
          if (alert.site?.name) {
            const existing = acc.find((item) => item.name === alert.site.name);
            if (existing) {
              existing.count++;
            } else {
              acc.push({ name: alert.site.name, count: 1 });
            }
          }
          return acc;
        }, [] as AlertByCategory[]).sort((a: AlertByCategory, b: AlertByCategory) => b.count - a.count).slice(0, 10);

        setAlertsBySite(siteData);

        // Update alerts by plant type
        const plantTypeData = alerts.reduce((acc: AlertByCategory[], alert: any) => {
          if (alert.plant_type?.name) {
            const existing = acc.find((item) => item.name === alert.plant_type.name);
            if (existing) {
              existing.count++;
            } else {
              acc.push({ name: alert.plant_type.name, count: 1 });
            }
          }
          return acc;
        }, [] as AlertByCategory[]).sort((a: AlertByCategory, b: AlertByCategory) => b.count - a.count).slice(0, 10);

        setAlertsByPlantType(plantTypeData);

        // Update alerts by hazard
        const hazardData = alerts.reduce((acc: AlertByCategory[], alert: any) => {
          alert.hazards?.forEach((hazard: any) => {
            if (hazard.name) {
              const existing = acc.find((item) => item.name === hazard.name);
              if (existing) {
                existing.count++;
              } else {
                acc.push({ name: hazard.name, count: 1 });
              }
            }
          });
          return acc;
        }, [] as AlertByCategory[]).sort((a: AlertByCategory, b: AlertByCategory) => b.count - a.count).slice(0, 10);

        setAlertsByHazard(hazardData);

      } else {
        // Fetch all dashboard data
        const [
          metricsResponse,
          chartResponse,
          recentAlertsResponse,
          alertsBySourceResponse,
          alertsByRegulationResponse,
          alertsByOrganizationResponse,
          alertsBySiteResponse,
          alertsByHazardResponse,
          alertsByPlantTypeResponse
        ] = await Promise.all([
          axios.get('/auth/verified/dashboard/metrics'),
          axios.get('/auth/verified/dashboard/alerts-over-time'),
          axios.get('/auth/verified/dashboard/recent-alerts'),
          axios.get('/auth/verified/dashboard/alerts-by-source'),
          axios.get('/auth/verified/dashboard/alerts-by-regulation'),
          axios.get('/auth/verified/dashboard/alerts-by-organization'),
          axios.get('/auth/verified/dashboard/alerts-by-site'),
          axios.get('/auth/verified/dashboard/alerts-by-hazard'),
          axios.get('/auth/verified/dashboard/alerts-by-plant-type'),
        ]);

        setMetrics(metricsResponse.data);
        setChartData({
          labels: chartResponse.data.map((item: any) => item.month),
          values: chartResponse.data.map((item: any) => item.count),
        });
        setRecentAlerts(recentAlertsResponse.data);
        setAlertsBySource(alertsBySourceResponse.data);
        setAlertsByRegulation(alertsByRegulationResponse.data);
        setAlertsByOrganization(alertsByOrganizationResponse.data);
        setAlertsBySite(alertsBySiteResponse.data);
        setAlertsByHazard(alertsByHazardResponse.data);
        setAlertsByPlantType(alertsByPlantTypeResponse.data);
      }

    } catch (error) {
      console.error('Dashboard data fetch failed: ', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleFiltersChange = (filters: any) => {
    fetchDashboardData(filters);
  }

  const kpiConfigs = [
    { key: 'total_alerts', title: 'Total Alerts', subtitle: 'Reported this month', trend: 'alerts' },
    { key: 'total_sources', title: 'Total Source', subtitle: 'Most reported source', trend: 'sources' },
    { key: 'total_regulations', title: 'Total Regulation', subtitle: 'Most reported regulation', trend: 'regulations' },
    { key: 'total_organizations', title: 'Total Organization', subtitle: 'Most reported organization', trend: 'organizations' },
    { key: 'total_sites', title: 'Total Site', subtitle: 'Most reported site', trend: 'sites' },
    { key: 'total_plant_types', title: 'Total Equipment', subtitle: 'Most reported equipment', trend: 'plant_types' },
    { key: 'total_hazards', title: 'Total Hazard', subtitle: 'Most reported hazard', trend: 'hazards' },
  ];

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
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
              {kpiConfigs.map((config, index) => (
                <KPIBlock
                  key={config.key}
                  title={config.title}
                  value={loading ? 0 : (metrics as any)?.[config.key] || 0}
                  trend={loading ? { percentage: 0, direction: 'stable', text: '' } : (metrics as any)?.trends?.[config.trend] || { percentage: 0, direction: 'stable', text: 'No data' }}
                  subtitle={config.subtitle}
                  loading={loading}
                />
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Column - Charts */}
              <div className="lg:col-span-3 space-y-6">
                {/* Alerts Over Time */}
                <Card>
                  <CardHeader>
                    <CardTitle>Alerts Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AreaChartComponent data={chartData} loading={loading} />
                  </CardContent>
                </Card>

                {/* Chart Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Alerts by Source</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <BarChartComponent data={alertsBySource} loading={loading} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Alerts by Organization</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <BarChartComponent data={alertsByOrganization} loading={loading} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Alerts by Site</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <BarChartComponent data={alertsBySite} loading={loading} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Equipment Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <BarChartComponent data={alertsByPlantType} loading={loading} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Alerts by Regulation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PieChartComponent data={alertsByRegulation} loading={loading} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Alerts by Hazard</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PieChartComponent data={alertsByHazard} loading={loading} />
                    </CardContent>
                  </Card>
                </div>


              </div>

              {/* Right Column - Filters */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Filters & Controls</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FiltersSidebar onFiltersChange={handleFiltersChange} />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recent Alerts Table */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentAlerts alerts={recentAlerts} loading={loading} />
              </CardContent>
            </Card>

          </div>
        </SidebarInset>
      </SidebarProvider >
    </>
  );
}
