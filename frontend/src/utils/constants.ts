export const API_CONFIG = {
    BASE_URL: (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api',
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
}

export const SOVI_CONSTANTS = {
    PARAMETERS: {
        EDUCATION: {
            key: 'education',
            label: 'Education',
            color: '#3b82f6',
            subParams: [
                { key: 'NOSCL', label: 'Number of Schools' },
                { key: 'PRIMSC', label: 'Primary School Completion' },
                { key: 'ENRLPR', label: 'Enrollment Rate Primary' },
                { key: 'ENRMA', label: 'Enrollment Rate Middle' },
                { key: 'PATS', label: 'Pupil-Teacher Ratio' },
                { key: 'ADLLIT', label: 'Adult Literacy' },
            ],
            weight: 0.2,
        },
        HEALTH: {
            key: 'health',
            label: 'Health',
            color: '#ef4444',
            subParams: [
                { key: 'DIARR', label: 'Diarrhea Cases' },
                { key: 'IMMUN', label: 'Immunization Rate' },
                { key: 'WTTI', label: 'WTTI Index' },
                { key: 'CbyladyH_W_PRE', label: 'Child Birth by Lady Health Worker (Pre)' },
                { key: 'CbyladyH_W_POST', label: 'Child Birth by Lady Health Worker (Post)' },
                { key: 'PNCONSL', label: 'Post Natal Consultation' },
                { key: 'FERTILITY', label: 'Fertility Rate' },
                { key: 'CHDISABL', label: 'Child Disability' },
            ],
            weight: 0.2,
        },
        FACILITY: {
            key: 'facility',
            label: 'Facility',
            color: '#10b981',
            subParams: [
                { key: 'TENURE', label: 'Housing Tenure' },
                { key: 'ROOMS', label: 'Number of Rooms' },
                { key: 'ELECTRIC', label: 'Electricity Access' },
                { key: 'TAPWATER', label: 'Tap Water Access' },
                { key: 'MEDIA', label: 'Media Exposure' },
                { key: 'INTERNET', label: 'Internet Access' },
            ],
            weight: 0.2,
        },
        ECONOMIC: {
            key: 'economic',
            label: 'Economic',
            color: '#f59e0b',
            subParams: [
                { key: 'QAGRI', label: 'Agriculture Quality' },
                { key: 'REMITT', label: 'Remittances' },
                { key: 'ECoH', label: 'Economic Household' },
                { key: 'BHU_F', label: 'Basic Health Unit Facilities' },
                { key: 'Fmly_P', label: 'Family Planning' },
                { key: 'Sch_F', label: 'School Facilities' },
                { key: 'Vat_F', label: 'VAT Facilities' },
                { key: 'Agro_F', label: 'Agriculture Facilities' },
                { key: 'Pol_F', label: 'Political Facilities' },
            ],
            weight: 0.2,
        },
        POPULATION: {
            key: 'population',
            label: 'Population',
            color: '#8b5cf6',
            subParams: [
                { key: 'QOLD', label: 'Quality of Old Age' },
                { key: 'QMID', label: 'Quality of Middle Age' },
                { key: 'Fpop', label: 'Female Population' },
                { key: 'Rpop', label: 'Rural Population' },
                { key: 'Upop', label: 'Urban Population' },
                { key: 'QKIDS', label: 'Quality for Kids' },
                { key: 'Growth_Rate', label: 'Growth Rate' },
            ],
            weight: 0.2,
        },
    },

    RATING_THRESHOLDS: [
        { min: 0, max: 20, rating: 1, label: 'Very-Low', color: '#10b981' },
        { min: 21, max: 40, rating: 2, label: 'Low', color: '#84cc16' },
        { min: 41, max: 60, rating: 3, label: 'Medium', color: '#f59e0b' },
        { min: 61, max: 80, rating: 4, label: 'High', color: '#ea580c' },
        { min: 81, max: 100, rating: 5, label: 'Extreme', color: '#dc2626' },
    ],

    MAP_CONFIG: {
        DEFAULT_CENTER: [71.5249, 30.3753] as [number, number], // Pakistan coordinates
        DEFAULT_ZOOM: 4,
        MIN_ZOOM: 2,
        MAX_ZOOM: 12,
    },

    LAYERS: {
        NATIONAL: {
            id: 'national-layer',
            name: 'National Boundary',
            url: 'http://172.18.7.35:8080/geoserver/gcop/wms',
            layerName: 'gcop:national_boundary',
            color: '#2563eb',
        },
        PROVINCIAL: {
            id: 'provincial-layer',
            name: 'Provincial Boundary',
            url: 'http://172.18.7.35:8080/geoserver/gcop/wms',
            layerName: 'gcop:provincial_boundary',
            color: '#7c3aed',
        },
        DISTRICT: {
            id: 'district-layer',
            name: 'District Boundary',
            url: 'http://172.18.7.35:8080/geoserver/gcop/wms',
            layerName: 'gcop:district_boundary',
            color: '#059669',
        },
    },
}

export const APP_CONSTANTS = {
    APP_NAME: (import.meta as any).env.VITE_APP_NAME || 'SoVI Portal',
    VERSION: (import.meta as any).env.VITE_APP_VERSION || '1.0.0',
    MAPBOX_TOKEN: (import.meta as any).env.VITE_MAPBOX_TOKEN || '',
    GEOSERVER_URL: (import.meta as any).env.VITE_GEOSERVER_URL || 'http://172.18.7.35:8080/geoserver',
}

export const STORAGE_KEYS = {
    AUTH_TOKEN: 'sovi_auth_token',
    USER_DATA: 'sovi_user_data',
    MAP_SETTINGS: 'sovi_map_settings',
    THEME: 'sovi_theme',
}

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    ADMIN: '/admin',
    ABOUT: '/about',
    DISTRICT_DETAIL: '/district/:id',
}