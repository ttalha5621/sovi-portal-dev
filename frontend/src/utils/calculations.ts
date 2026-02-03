import { SOVI_CONSTANTS } from './constants'
import { DistrictData, CalculatedScores } from '../types/sovi.types'

export function calculateEducationScore(data: Partial<DistrictData>): number {
    const {
        NOSCL = 0, PRIMSC = 0, ENRLPR = 0, ENRMA = 0, PATS = 0, ADLLIT = 0
    } = data

    const score = (
        NOSCL * 0.3 +
        PRIMSC * 0.15 +
        ENRLPR * 0.15 +
        ENRMA * 0.1 +
        PATS * 0.15 +
        ADLLIT * 0.15
    )

    return Number(score.toFixed(2))
}

export function calculateHealthScore(data: Partial<DistrictData>): number {
    const {
        DIARR = 0, IMMUN = 0, WTTI = 0, CbyladyH_W_PRE = 0,
        CbyladyH_W_POST = 0, PNCONSL = 0, FERTILITY = 0, CHDISABL = 0
    } = data

    const score = (
        DIARR * 0.1 +
        IMMUN * 0.125 +
        WTTI * 0.125 +
        CbyladyH_W_PRE * 0.1 +
        CbyladyH_W_POST * 0.1 +
        PNCONSL * 0.175 +
        FERTILITY * 0.1 +
        CHDISABL * 0.175
    )

    return Number(score.toFixed(2))
}

export function calculateEconomicScore(data: Partial<DistrictData>): number {
    const {
        ECoH = 0, BHU_F = 0, Fmly_P = 0, Sch_F = 0,
        Vat_F = 0, Agro_F = 0, Pol_F = 0
    } = data

    const score = (
        ECoH * 0.2 +
        BHU_F * 0.15 +
        Fmly_P * 0.15 +
        Sch_F * 0.2 +
        Vat_F * 0.05 +
        Agro_F * 0.15 +
        Pol_F * 0.1
    )

    return Number(score.toFixed(2))
}

export function calculateFacilityScore(data: Partial<DistrictData>): number {
    const {
        TENURE = 0, ROOMS = 0, ELECTRIC = 0, TAPWATER = 0, MEDIA = 0, INTERNET = 0
    } = data

    const score = (
        TENURE * 0.075 +
        ROOMS * 0.075 +
        ELECTRIC * 0.2 +
        TAPWATER * 0.2 +
        MEDIA * 0.175 +
        INTERNET * 0.175
    )

    return Number(score.toFixed(2))
}

export function calculatePopulationScore(data: Partial<DistrictData>): number {
    const {
        QOLD = 0, QMID = 0, Fpop = 0, Rpop = 0,
        Upop = 0, QKIDS = 0, Growth_Rate = 0
    } = data

    const score = (
        QOLD * 0.15 +
        QMID * 0.1 +
        Fpop * 0.15 +
        Rpop * 0.175 +
        Upop * 0.125 +
        QKIDS * 0.15 +
        Growth_Rate * 0.15
    )

    return Number(score.toFixed(2))
}

export function calculateTotalSoVI(scores: {
    Sedu: number
    Shealth: number
    Seconomic: number
    Sfacility: number
    Spopulation: number
}): number {
    const {
        Sedu = 0, Shealth = 0, Seconomic = 0,
        Sfacility = 0, Spopulation = 0
    } = scores

    const total = (
        Sedu * 0.2 +
        Shealth * 0.2 +
        Seconomic * 0.2 +
        Sfacility * 0.2 +
        Spopulation * 0.2
    )

    return Number(total.toFixed(2))
}

export function calculateAllScores(data: Partial<DistrictData>): CalculatedScores {
    const Sedu = calculateEducationScore(data)
    const Shealth = calculateHealthScore(data)
    const Seconomic = calculateEconomicScore(data)
    const Sfacility = calculateFacilityScore(data)
    const Spopulation = calculatePopulationScore(data)

    const totalSoVI = calculateTotalSoVI({
        Sedu,
        Shealth,
        Seconomic,
        Sfacility,
        Spopulation,
    })

    const rating = getRating(totalSoVI)

    return {
        Sedu,
        Shealth,
        Seconomic,
        Sfacility,
        Spopulation,
        totalSoVI,
        rating,
    }
}

export function getRating(score: number): number {
    const threshold = SOVI_CONSTANTS.RATING_THRESHOLDS.find(
        t => score >= t.min && score <= t.max
    )
    return threshold ? threshold.rating : 1
}

export function getRatingLabel(score: number): string {
    const threshold = SOVI_CONSTANTS.RATING_THRESHOLDS.find(
        t => score >= t.min && score <= t.max
    )
    return threshold ? threshold.label : 'Unknown'
}

export function getRatingColor(score: number): string {
    const threshold = SOVI_CONSTANTS.RATING_THRESHOLDS.find(
        t => score >= t.min && score <= t.max
    )
    return threshold ? threshold.color : '#6b7280'
}

export function formatScore(score?: number): string {
    if (score === undefined || score === null) return 'N/A'
    return score.toFixed(2)
}

export function calculateImprovement(current: number, previous: number): {
    value: number
    percentage: number
    isImprovement: boolean
} {
    const value = current - previous
    const percentage = previous === 0 ? 100 : (value / previous) * 100
    const isImprovement = value > 0

    return {
        value: Number(value.toFixed(2)),
        percentage: Number(percentage.toFixed(2)),
        isImprovement,
    }
}

export function validateScoreValue(value: number, min: number = 0, max: number = 100): boolean {
    return value >= min && value <= max
}

export function calculateAverage(scores: number[]): number {
    if (scores.length === 0) return 0
    const sum = scores.reduce((acc, score) => acc + score, 0)
    return Number((sum / scores.length).toFixed(2))
}