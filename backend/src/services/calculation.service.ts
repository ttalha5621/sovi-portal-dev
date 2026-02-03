import { SOVI_CONSTANTS } from '../config/constants';
import { CalculatedScores } from '../types/sovi.types';
import { calculateScores } from '../utils/calculateScores';
import logger from '../utils/logger';

export class CalculationService {
    calculateEducationScore(data: {
        NOSCL?: number;
        PRIMSC?: number;
        ENRLPR?: number;
        ENRMA?: number;
        PATS?: number;
        ADLLIT?: number;
    }): number {
        const {
            NOSCL = 0, PRIMSC = 0, ENRLPR = 0, ENRMA = 0, PATS = 0, ADLLIT = 0
        } = data;

        const score = (
            NOSCL * SOVI_CONSTANTS.EDUCATION_WEIGHTS.NOSCL +
            PRIMSC * SOVI_CONSTANTS.EDUCATION_WEIGHTS.PRIMSC +
            ENRLPR * SOVI_CONSTANTS.EDUCATION_WEIGHTS.ENRLPR +
            ENRMA * SOVI_CONSTANTS.EDUCATION_WEIGHTS.ENRMA +
            PATS * SOVI_CONSTANTS.EDUCATION_WEIGHTS.PATS +
            ADLLIT * SOVI_CONSTANTS.EDUCATION_WEIGHTS.ADLLIT
        );

        return Number(score.toFixed(2));
    }

    calculateHealthScore(data: {
        DIARR?: number;
        IMMUN?: number;
        WTTI?: number;
        CbyladyH_W_PRE?: number;
        CbyladyH_W_POST?: number;
        PNCONSL?: number;
        FERTILITY?: number;
        CHDISABL?: number;
    }): number {
        const {
            DIARR = 0, IMMUN = 0, WTTI = 0, CbyladyH_W_PRE = 0,
            CbyladyH_W_POST = 0, PNCONSL = 0, FERTILITY = 0, CHDISABL = 0
        } = data;

        const score = (
            DIARR * SOVI_CONSTANTS.HEALTH_WEIGHTS.DIARR +
            IMMUN * SOVI_CONSTANTS.HEALTH_WEIGHTS.IMMUN +
            WTTI * SOVI_CONSTANTS.HEALTH_WEIGHTS.WTTI +
            CbyladyH_W_PRE * SOVI_CONSTANTS.HEALTH_WEIGHTS.CbyladyH_W_PRE +
            CbyladyH_W_POST * SOVI_CONSTANTS.HEALTH_WEIGHTS.CbyladyH_W_POST +
            PNCONSL * SOVI_CONSTANTS.HEALTH_WEIGHTS.PNCONSL +
            FERTILITY * SOVI_CONSTANTS.HEALTH_WEIGHTS.FERTILITY +
            CHDISABL * SOVI_CONSTANTS.HEALTH_WEIGHTS.CHDISABL
        );

        return Number(score.toFixed(2));
    }

    calculateEconomicScore(data: {
        ECoH?: number;
        BHU_F?: number;
        Fmly_P?: number;
        Sch_F?: number;
        Vat_F?: number;
        Agro_F?: number;
        Pol_F?: number;
    }): number {
        const {
            ECoH = 0, BHU_F = 0, Fmly_P = 0, Sch_F = 0,
            Vat_F = 0, Agro_F = 0, Pol_F = 0
        } = data;

        const score = (
            ECoH * SOVI_CONSTANTS.ECONOMIC_WEIGHTS.ECoH +
            BHU_F * SOVI_CONSTANTS.ECONOMIC_WEIGHTS.BHU_F +
            Fmly_P * SOVI_CONSTANTS.ECONOMIC_WEIGHTS.Fmly_P +
            Sch_F * SOVI_CONSTANTS.ECONOMIC_WEIGHTS.Sch_F +
            Vat_F * SOVI_CONSTANTS.ECONOMIC_WEIGHTS.Vat_F +
            Agro_F * SOVI_CONSTANTS.ECONOMIC_WEIGHTS.Agro_F +
            Pol_F * SOVI_CONSTANTS.ECONOMIC_WEIGHTS.Pol_F
        );

        return Number(score.toFixed(2));
    }

    calculateFacilityScore(data: {
        TENURE?: number;
        ROOMS?: number;
        ELECTRIC?: number;
        TAPWATER?: number;
        MEDIA?: number;
        INTERNET?: number;
    }): number {
        const {
            TENURE = 0, ROOMS = 0, ELECTRIC = 0, TAPWATER = 0, MEDIA = 0, INTERNET = 0
        } = data;

        const score = (
            TENURE * SOVI_CONSTANTS.FACILITY_WEIGHTS.TENURE +
            ROOMS * SOVI_CONSTANTS.FACILITY_WEIGHTS.ROOMS +
            ELECTRIC * SOVI_CONSTANTS.FACILITY_WEIGHTS.ELECTRIC +
            TAPWATER * SOVI_CONSTANTS.FACILITY_WEIGHTS.TAPWATER +
            MEDIA * SOVI_CONSTANTS.FACILITY_WEIGHTS.MEDIA +
            INTERNET * SOVI_CONSTANTS.FACILITY_WEIGHTS.INTERNET
        );

        return Number(score.toFixed(2));
    }

    calculatePopulationScore(data: {
        QOLD?: number;
        QMID?: number;
        Fpop?: number;
        Rpop?: number;
        Upop?: number;
        QKIDS?: number;
        Growth_Rate?: number;
    }): number {
        const {
            QOLD = 0, QMID = 0, Fpop = 0, Rpop = 0,
            Upop = 0, QKIDS = 0, Growth_Rate = 0
        } = data;

        const score = (
            QOLD * SOVI_CONSTANTS.POPULATION_WEIGHTS.QOLD +
            QMID * SOVI_CONSTANTS.POPULATION_WEIGHTS.QMID +
            Fpop * SOVI_CONSTANTS.POPULATION_WEIGHTS.Fpop +
            Rpop * SOVI_CONSTANTS.POPULATION_WEIGHTS.Rpop +
            Upop * SOVI_CONSTANTS.POPULATION_WEIGHTS.Upop +
            QKIDS * SOVI_CONSTANTS.POPULATION_WEIGHTS.QKIDS +
            Growth_Rate * SOVI_CONSTANTS.POPULATION_WEIGHTS.Growth_Rate
        );

        return Number(score.toFixed(2));
    }

    calculateTotalSoVI(scores: {
        Sedu: number;
        Shealth: number;
        Seconomic: number;
        Sfacility: number;
        Spopulation: number;
    }): number {
        const {
            Sedu = 0, Shealth = 0, Seconomic = 0,
            Sfacility = 0, Spopulation = 0
        } = scores;

        const total = (
            Sedu * SOVI_CONSTANTS.SOVI_WEIGHTS.EDUCATION +
            Shealth * SOVI_CONSTANTS.SOVI_WEIGHTS.HEALTH +
            Seconomic * SOVI_CONSTANTS.SOVI_WEIGHTS.ECONOMIC +
            Sfacility * SOVI_CONSTANTS.SOVI_WEIGHTS.FACILITY +
            Spopulation * SOVI_CONSTANTS.SOVI_WEIGHTS.POPULATION
        );

        return Number(total.toFixed(2));
    }

    getRating(score: number): { rating: number; label: string } {
        const threshold = SOVI_CONSTANTS.RATING_THRESHOLDS.find(
            (t: any) => score >= t.min && score <= t.max
        ) || SOVI_CONSTANTS.RATING_THRESHOLDS[0];

        return {
            rating: threshold.rating,
            label: threshold.label
        };
    }

    calculateAllScores(data: any): CalculatedScores {
        return calculateScores(data);
    }

    validateScoreImprovement(
        currentData: any,
        newData: any
    ): { isValid: boolean; message: string; improvements: Record<string, number> } {
        const currentScores = calculateScores(currentData);
        const newScores = calculateScores(newData);

        const improvements: Record<string, number> = {};

        // Calculate improvement for each parameter
        const parameters = ['Sedu', 'Shealth', 'Seconomic', 'Sfacility', 'Spopulation', 'totalSoVI'];

        parameters.forEach(param => {
            const current = currentScores[param as keyof CalculatedScores] || 0;
            const newScore = newScores[param as keyof CalculatedScores] || 0;
            improvements[param] = Number((newScore - current).toFixed(2));
        });

        // Check if overall score improved
        const overallImprovement = improvements.totalSoVI;
        const isValid = overallImprovement >= -10 && overallImprovement <= 50; // Reasonable bounds

        return {
            isValid,
            message: isValid
                ? 'Score improvement is within acceptable range'
                : 'Score improvement is outside acceptable range',
            improvements
        };
    }
}

export default new CalculationService();