import { DistrictData } from './sovi.types';

export interface District {
    id: number;
    name: string;
    fid: string | null;
    division: string | null;
    province: string | null;
    country: string;
    soviScore: number | null;
    rating: number | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateDistrictInput {
    name: string;
    fid?: string;
    division?: string;
    province?: string;
    country?: string;
}

export interface UpdateDistrictInput extends Partial<CreateDistrictInput> { }

export interface DistrictWithData extends District {
    data: DistrictData[];
}

export interface DistrictListItem {
    id: number;
    name: string;
    province: string | null;
    soviScore: number | null;
    rating: number | null;
}