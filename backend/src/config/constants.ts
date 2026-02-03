export const SOVI_CONSTANTS = {
    // Parameter weights
    EDUCATION_WEIGHTS: {
        NOSCL: 0.3,
        PRIMSC: 0.15,
        ENRLPR: 0.15,
        ENRMA: 0.1,
        PATS: 0.15,
        ADLLIT: 0.15
    },

    HEALTH_WEIGHTS: {
        DIARR: 0.1,
        IMMUN: 0.125,
        WTTI: 0.125,
        CbyladyH_W_PRE: 0.1,
        CbyladyH_W_POST: 0.1,
        PNCONSL: 0.175,
        FERTILITY: 0.1,
        CHDISABL: 0.175
    },

    ECONOMIC_WEIGHTS: {
        ECoH: 0.2,
        BHU_F: 0.15,
        Fmly_P: 0.15,
        Sch_F: 0.2,
        Vat_F: 0.05,
        Agro_F: 0.15,
        Pol_F: 0.1
    },

    FACILITY_WEIGHTS: {
        TENURE: 0.075,
        ROOMS: 0.075,
        ELECTRIC: 0.2,
        TAPWATER: 0.2,
        MEDIA: 0.175,
        INTERNET: 0.175
    },

    POPULATION_WEIGHTS: {
        QOLD: 0.15,
        QMID: 0.1,
        Fpop: 0.15,
        Rpop: 0.175,
        Upop: 0.125,
        QKIDS: 0.15,
        Growth_Rate: 0.15
    },

    // SoVI weights
    SOVI_WEIGHTS: {
        EDUCATION: 0.2,
        HEALTH: 0.2,
        ECONOMIC: 0.2,
        FACILITY: 0.2,
        POPULATION: 0.2
    },

    // Rating thresholds
    RATING_THRESHOLDS: [
        { min: 0, max: 20, rating: 1, label: 'Very-Low' },
        { min: 21, max: 40, rating: 2, label: 'Low' },
        { min: 41, max: 60, rating: 3, label: 'Medium' },
        { min: 61, max: 80, rating: 4, label: 'High' },
        { min: 81, max: 100, rating: 5, label: 'Extreme' }
    ]
};

export const API_CONSTANTS = {
    PAGINATION: {
        DEFAULT_PAGE: 1,
        DEFAULT_LIMIT: 10,
        MAX_LIMIT: 100
    }
};

export const AUTH_CONSTANTS = {
    ROLES: {
        ADMIN: 'ADMIN',
        USER: 'USER'
    },
    TOKEN_EXPIRY: '7d'
};