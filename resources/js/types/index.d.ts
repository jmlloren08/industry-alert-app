import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface DashboardMetrics {
    total_alerts: number
    total_sources: number
    total_regulations: number
    total_organizations: number
    total_sites: number
    total_plant_types: number
    total_plant_makes: number
    total_plant_models: number
    total_hazards: number
    trends: {
        alerts: TrendData
        sources: TrendData
        regulations: TrendData
        organizations: TrendData
        sites: TrendData
        plant_types: TrendData
        plant_makes: TrendData
        plant_models: TrendData
        hazards: TrendData
    }
}

export interface TrendData {
    percentage: number
    direction: 'up' | 'down' | 'stable'
    text: string
}

export interface AlertByCategory {
    name: string
    count: number
}

export interface RecentAlert {
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

export interface DashboardFilters {
    start_date?: string
    end_date?: string
    source_id?: string
    regulation_id?: string
    organization_id?: string
    site_id?: string
    type_id?: string
    hazard_id?: string
}