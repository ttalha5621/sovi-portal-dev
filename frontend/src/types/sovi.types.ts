export interface DistrictData {
    id: number
    districtId: number
    year: number

    // Education
    NOSCL?: number
    PRIMSC?: number
    ENRLPR?: number
    ENRMA?: number
    PATS?: number
    ADLLIT?: number
    Sedu?: number

    // Health
    DIARR?: number
    IMMUN?: number
    WTTI?: number
    CbyladyH_W_PRE?: number
    CbyladyH_W_POST?: number
    PNCONSL?: number
    FERTILITY?: number
    CHDISABL?: number
    Shealth?: number

    // Facility
    TENURE?: number
    ROOMS?: number
    ELECTRIC?: number
    TAPWATER?: number
    MEDIA?: number
    INTERNET?: number
    Sfacility?: number

    // Economic
    QAGRI?: number
    REMITT?: number
    ECoH?: number
    BHU_F?: number
    Fmly_P?: number
    Sch_F?: number
    Vat_F?: number
    Agro_F?: number
    Pol_F?: number
    Seconomic?: number

    // Population
    QOLD?: number
    QMID?: number
    Fpop?: number
    Rpop?: number
    Upop?: number
    QKIDS?: number
    Growth_Rate?: number
    Spopulation?: number

    // Final scores
    totalSoVI?: number
    rating?: number

    createdAt: string
    updatedAt: string
}

export interface CreateDistrictDataInput {
    districtId: number
    year: number
    NOSCL?: number
    PRIMSC?: number
    ENRLPR?: number
    ENRMA?: number
    PATS?: number
    ADLLIT?: number
    DIARR?: number
    IMMUN?: number
    WTTI?: number
    CbyladyH_W_PRE?: number
    CbyladyH_W_POST?: number
    PNCONSL?: number
    FERTILITY?: number
    CHDISABL?: number
    TENURE?: number
    ROOMS?: number
    ELECTRIC?: number
    TAPWATER?: number
    MEDIA?: number
    INTERNET?: number
    QAGRI?: number
    REMITT?: number
    ECoH?: number
    BHU_F?: number
    Fmly_P?: number
    Sch_F?: number
    Vat_F?: number
    Agro_F?: number
    Pol_F?: number
    QOLD?: number
    QMID?: number
    Fpop?: number
    Rpop?: number
    Upop?: number
    QKIDS?: number
    Growth_Rate?: number
}

export interface CalculatedScores {
    Sedu: number
    Shealth: number
    Sfacility: number
    Seconomic: number
    Spopulation: number
    totalSoVI: number
    rating: number
}

export interface MapDistrictData {
    id: number
    name: string
    fid?: string
    division?: string
    province?: string
    country: string
    soviScore: number
    rating: number
    scores: {
        Sedu: number
        Shealth: number
        Sfacility: number
        Seconomic: number
        Spopulation: number
    } | null
}

export interface YearlyTrends {
    years: number[]
    scores: number[]
    parameters: {
        Sedu: number[]
        Shealth: number[]
        Sfacility: number[]
        Seconomic: number[]
        Spopulation: number[]
    }
}

export interface ComparativeAnalysis {
    district: MapDistrictData
    provinceAverage: number
    nationalAverage: number
    similarDistricts: MapDistrictData[]
}

export interface ScoreImprovement {
    isValid: boolean
    message: string
    improvements: Record<string, number>
}