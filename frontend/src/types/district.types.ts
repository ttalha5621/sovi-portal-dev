export interface District {
    id: number
    name: string
    fid?: string
    division?: string
    province?: string
    country: string
    soviScore?: number
    rating?: number
    createdAt: string
    updatedAt: string
}

export interface DistrictListItem {
    id: number
    name: string
    province?: string
    soviScore?: number
    rating?: number
}

export interface DistrictWithData extends District {
    data: DistrictData[]
}

export interface CreateDistrictInput {
    name: string
    fid?: string
    division?: string
    province?: string
    country?: string
}

export interface UpdateDistrictInput extends Partial<CreateDistrictInput> { }

export interface DistrictsResponse {
    districts: DistrictListItem[]
    total: number
    pages: number
}

export interface DistrictsSummary {
    totalDistricts: number
    byProvince: Record<string, number>
    averageScore: number
}