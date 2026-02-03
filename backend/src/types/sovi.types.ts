export interface DistrictData {
    id: number;
    districtId: number;
    year: number;

    // Education
    NOSCL: number | null;
    PRIMSC: number | null;
    ENRLPR: number | null;
    ENRMA: number | null;
    PATS: number | null;
    ADLLIT: number | null;
    Sedu: number | null;

    // Health
    DIARR: number | null;
    IMMUN: number | null;
    WTTI: number | null;
    CbyladyH_W_PRE: number | null;
    CbyladyH_W_POST: number | null;
    PNCONSL: number | null;
    FERTILITY: number | null;
    CHDISABL: number | null;
    Shealth: number | null;

    // Facility
    TENURE: number | null;
    ROOMS: number | null;
    ELECTRIC: number | null;
    TAPWATER: number | null;
    MEDIA: number | null;
    INTERNET: number | null;
    Sfacility: number | null;

    // Economic
    QAGRI: number | null;
    REMITT: number | null;
    ECoH: number | null;
    BHU_F: number | null;
    Fmly_P: number | null;
    Sch_F: number | null;
    Vat_F: number | null;
    Agro_F: number | null;
    Pol_F: number | null;
    Seconomic: number | null;

    // Population
    QOLD: number | null;
    QMID: number | null;
    Fpop: number | null;
    Rpop: number | null;
    Upop: number | null;
    QKIDS: number | null;
    Growth_Rate: number | null;
    Spopulation: number | null;

    // Final scores
    totalSoVI: number | null;
    rating: number | null;

    createdAt: Date;
    updatedAt: Date;
}

export interface CreateDistrictDataInput {
    districtId: number;
    year: number;

    // Education
    NOSCL?: number;
    PRIMSC?: number;
    ENRLPR?: number;
    ENRMA?: number;
    PATS?: number;
    ADLLIT?: number;

    // Health
    DIARR?: number;
    IMMUN?: number;
    WTTI?: number;
    CbyladyH_W_PRE?: number;
    CbyladyH_W_POST?: number;
    PNCONSL?: number;
    FERTILITY?: number;
    CHDISABL?: number;

    // Facility
    TENURE?: number;
    ROOMS?: number;
    ELECTRIC?: number;
    TAPWATER?: number;
    MEDIA?: number;
    INTERNET?: number;

    // Economic
    QAGRI?: number;
    REMITT?: number;
    ECoH?: number;
    BHU_F?: number;
    Fmly_P?: number;
    Sch_F?: number;
    Vat_F?: number;
    Agro_F?: number;
    Pol_F?: number;

    // Population
    QOLD?: number;
    QMID?: number;
    Fpop?: number;
    Rpop?: number;
    Upop?: number;
    QKIDS?: number;
    Growth_Rate?: number;
}

export interface UpdateDistrictDataInput extends Partial<CreateDistrictDataInput> { }

export interface CalculatedScores {
    Sedu: number;
    Shealth: number;
    Sfacility: number;
    Seconomic: number;
    Spopulation: number;
    totalSoVI: number;
    rating: number;
}

export interface MapDistrictData {
    id: number;
    name: string;
    fid?: string;
    division?: string;
    province?: string;
    country: string;
    soviScore: number;
    rating: number;
    scores: {
        Sedu: number;
        Shealth: number;
        Sfacility: number;
        Seconomic: number;
        Spopulation: number;
    } | null;
}