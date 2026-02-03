import { SOVI_CONSTANTS } from '../config/constants';
import { DistrictData, CalculatedScores } from '../types/sovi.types';

export function calculateScores(data: Partial<DistrictData>): CalculatedScores {
  const {
    NOSCL, PRIMSC, ENRLPR, ENRMA, PATS, ADLLIT,
    DIARR, IMMUN, WTTI, CbyladyH_W_PRE, CbyladyH_W_POST,
    PNCONSL, FERTILITY, CHDISABL,
    TENURE, ROOMS, ELECTRIC, TAPWATER, MEDIA, INTERNET,
    QAGRI, REMITT, ECoH, BHU_F, Fmly_P, Sch_F,
    Vat_F, Agro_F, Pol_F,
    QOLD, QMID, Fpop, Rpop, Upop, QKIDS, Growth_Rate
  } = data;

  // Education Score
  const Sedu = (
    (NOSCL || 0) * SOVI_CONSTANTS.EDUCATION_WEIGHTS.NOSCL +
    (PRIMSC || 0) * SOVI_CONSTANTS.EDUCATION_WEIGHTS.PRIMSC +
    (ENRLPR || 0) * SOVI_CONSTANTS.EDUCATION_WEIGHTS.ENRLPR +
    (ENRMA || 0) * SOVI_CONSTANTS.EDUCATION_WEIGHTS.ENRMA +
    (PATS || 0) * SOVI_CONSTANTS.EDUCATION_WEIGHTS.PATS +
    (ADLLIT || 0) * SOVI_CONSTANTS.EDUCATION_WEIGHTS.ADLLIT
  );

  // Health Score
  const Shealth = (
    (DIARR || 0) * SOVI_CONSTANTS.HEALTH_WEIGHTS.DIARR +
    (IMMUN || 0) * SOVI_CONSTANTS.HEALTH_WEIGHTS.IMMUN +
    (WTTI || 0) * SOVI_CONSTANTS.HEALTH_WEIGHTS.WTTI +
    (CbyladyH_W_PRE || 0) * SOVI_CONSTANTS.HEALTH_WEIGHTS.CbyladyH_W_PRE +
    (CbyladyH_W_POST || 0) * SOVI_CONSTANTS.HEALTH_WEIGHTS.CbyladyH_W_POST +
    (PNCONSL || 0) * SOVI_CONSTANTS.HEALTH_WEIGHTS.PNCONSL +
    (FERTILITY || 0) * SOVI_CONSTANTS.HEALTH_WEIGHTS.FERTILITY +
    (CHDISABL || 0) * SOVI_CONSTANTS.HEALTH_WEIGHTS.CHDISABL
  );

  // Economic Score
  const Seconomic = (
    (ECoH || 0) * SOVI_CONSTANTS.ECONOMIC_WEIGHTS.ECoH +
    (BHU_F || 0) * SOVI_CONSTANTS.ECONOMIC_WEIGHTS.BHU_F +
    (Fmly_P || 0) * SOVI_CONSTANTS.ECONOMIC_WEIGHTS.Fmly_P +
    (Sch_F || 0) * SOVI_CONSTANTS.ECONOMIC_WEIGHTS.Sch_F +
    (Vat_F || 0) * SOVI_CONSTANTS.ECONOMIC_WEIGHTS.Vat_F +
    (Agro_F || 0) * SOVI_CONSTANTS.ECONOMIC_WEIGHTS.Agro_F +
    (Pol_F || 0) * SOVI_CONSTANTS.ECONOMIC_WEIGHTS.Pol_F
  );

  // Facility Score
  const Sfacility = (
    (TENURE || 0) * SOVI_CONSTANTS.FACILITY_WEIGHTS.TENURE +
    (ROOMS || 0) * SOVI_CONSTANTS.FACILITY_WEIGHTS.ROOMS +
    (ELECTRIC || 0) * SOVI_CONSTANTS.FACILITY_WEIGHTS.ELECTRIC +
    (TAPWATER || 0) * SOVI_CONSTANTS.FACILITY_WEIGHTS.TAPWATER +
    (MEDIA || 0) * SOVI_CONSTANTS.FACILITY_WEIGHTS.MEDIA +
    (INTERNET || 0) * SOVI_CONSTANTS.FACILITY_WEIGHTS.INTERNET
  );

  // Population Score
  const Spopulation = (
    (QOLD || 0) * SOVI_CONSTANTS.POPULATION_WEIGHTS.QOLD +
    (QMID || 0) * SOVI_CONSTANTS.POPULATION_WEIGHTS.QMID +
    (Fpop || 0) * SOVI_CONSTANTS.POPULATION_WEIGHTS.Fpop +
    (Rpop || 0) * SOVI_CONSTANTS.POPULATION_WEIGHTS.Rpop +
    (Upop || 0) * SOVI_CONSTANTS.POPULATION_WEIGHTS.Upop +
    (QKIDS || 0) * SOVI_CONSTANTS.POPULATION_WEIGHTS.QKIDS +
    (Growth_Rate || 0) * SOVI_CONSTANTS.POPULATION_WEIGHTS.Growth_Rate
  );

  // Total SoVI Score
  const totalSoVI = (
    Sedu * SOVI_CONSTANTS.SOVI_WEIGHTS.EDUCATION +
    Shealth * SOVI_CONSTANTS.SOVI_WEIGHTS.HEALTH +
    Seconomic * SOVI_CONSTANTS.SOVI_WEIGHTS.ECONOMIC +
    Sfacility * SOVI_CONSTANTS.SOVI_WEIGHTS.FACILITY +
    Spopulation * SOVI_CONSTANTS.SOVI_WEIGHTS.POPULATION
  );

  // Calculate rating
  const ratingThreshold = SOVI_CONSTANTS.RATING_THRESHOLDS.find(
    threshold => totalSoVI >= threshold.min && totalSoVI <= threshold.max
  ) || SOVI_CONSTANTS.RATING_THRESHOLDS[0];

  return {
    Sedu: Number(Sedu.toFixed(2)),
    Shealth: Number(Shealth.toFixed(2)),
    Seconomic: Number(Seconomic.toFixed(2)),
    Sfacility: Number(Sfacility.toFixed(2)),
    Spopulation: Number(Spopulation.toFixed(2)),
    totalSoVI: Number(totalSoVI.toFixed(2)),
    rating: ratingThreshold.rating
  };
}

export function getRatingLabel(rating: number): string {
  const ratingInfo = SOVI_CONSTANTS.RATING_THRESHOLDS.find((r: any) => r.rating === rating);
  return ratingInfo ? ratingInfo.label : 'Unknown';
}

export function validateSoVIData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check required fields
  if (!data.districtId) errors.push('District ID is required');
  if (!data.year) errors.push('Year is required');
  
  // Validate numeric ranges
  const numericFields = [
    'NOSCL', 'PRIMSC', 'ENRLPR', 'ENRMA', 'PATS', 'ADLLIT',
    'DIARR', 'IMMUN', 'WTTI', 'CbyladyH_W_PRE', 'CbyladyH_W_POST',
    'PNCONSL', 'FERTILITY', 'CHDISABL',
    'TENURE', 'ROOMS', 'ELECTRIC', 'TAPWATER', 'MEDIA', 'INTERNET',
    'QAGRI', 'REMITT', 'ECoH', 'BHU_F', 'Fmly_P', 'Sch_F',
    'Vat_F', 'Agro_F', 'Pol_F',
    'QOLD', 'QMID', 'Fpop', 'Rpop', 'Upop', 'QKIDS', 'Growth_Rate'
  ];
  
  numericFields.forEach(field => {
    if (data[field] !== undefined && data[field] !== null) {
      const value = Number(data[field]);
      if (isNaN(value)) {
        errors.push(`${field} must be a number`);
      } else if (value < 0 || value > 100) {
        errors.push(`${field} must be between 0 and 100`);
      }
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}