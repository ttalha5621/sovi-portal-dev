import { PrismaClient } from '@prisma/client';
import { calculateScores } from '../utils/calculateScores';

const prisma = new PrismaClient();

function generateRandomScore(min: number, max: number): number {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

async function seedSoviData() {
    console.log('Seeding SoVI data...');

    // Get all districts
    const districts = await prisma.district.findMany();
    const currentYear = new Date().getFullYear();

    for (const district of districts) {
        // Generate data for the last 5 years
        for (let yearOffset = 0; yearOffset < 5; yearOffset++) {
            const year = currentYear - yearOffset;

            // Check if data already exists for this district and year
            const existingData = await prisma.districtData.findFirst({
                where: {
                    districtId: district.id,
                    year: year
                }
            });

            if (existingData) {
                console.log(`Data already exists for ${district.name} (${year})`);
                continue;
            }

            // Generate random data for each parameter
            const soviData = {
                districtId: district.id,
                year: year,

                // Education
                NOSCL: generateRandomScore(50, 95),
                PRIMSC: generateRandomScore(60, 90),
                ENRLPR: generateRandomScore(70, 95),
                ENRMA: generateRandomScore(50, 85),
                PATS: generateRandomScore(20, 60),
                ADLLIT: generateRandomScore(40, 80),

                // Health
                DIARR: generateRandomScore(10, 40),
                IMMUN: generateRandomScore(60, 95),
                WTTI: generateRandomScore(50, 85),
                CbyladyH_W_PRE: generateRandomScore(30, 80),
                CbyladyH_W_POST: generateRandomScore(25, 75),
                PNCONSL: generateRandomScore(40, 85),
                FERTILITY: generateRandomScore(2.5, 4.5),
                CHDISABL: generateRandomScore(2, 15),

                // Facility
                TENURE: generateRandomScore(40, 90),
                ROOMS: generateRandomScore(2, 5),
                ELECTRIC: generateRandomScore(70, 99),
                TAPWATER: generateRandomScore(50, 90),
                MEDIA: generateRandomScore(30, 80),
                INTERNET: generateRandomScore(10, 70),

                // Economic
                QAGRI: generateRandomScore(30, 80),
                REMITT: generateRandomScore(5, 40),
                ECoH: generateRandomScore(20, 70),
                BHU_F: generateRandomScore(40, 90),
                Fmly_P: generateRandomScore(30, 80),
                Sch_F: generateRandomScore(50, 90),
                Vat_F: generateRandomScore(20, 70),
                Agro_F: generateRandomScore(30, 80),
                Pol_F: generateRandomScore(10, 60),

                // Population
                QOLD: generateRandomScore(20, 70),
                QMID: generateRandomScore(30, 80),
                Fpop: generateRandomScore(40, 52),
                Rpop: generateRandomScore(30, 80),
                Upop: generateRandomScore(20, 70),
                QKIDS: generateRandomScore(25, 75),
                Growth_Rate: generateRandomScore(1.5, 3.5)
            };

            // Calculate scores
            const calculatedScores = calculateScores(soviData);

            // Create district data
            await prisma.districtData.create({
                data: {
                    ...soviData,
                    ...calculatedScores
                }
            });

            // Update district's overall score if this is the latest year
            if (yearOffset === 0) {
                await prisma.district.update({
                    where: { id: district.id },
                    data: {
                        soviScore: calculatedScores.totalSoVI,
                        rating: calculatedScores.rating
                    }
                });
            }

            console.log(`SoVI data seeded for ${district.name} (${year}) - Score: ${calculatedScores.totalSoVI}`);
        }
    }

    console.log('SoVI data seeding completed!');
}