import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { calculateScores } from './src/utils/calculateScores';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await prisma.districtData.deleteMany();
    await prisma.district.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ Cleared existing data');

    // Create users
    const users = [
        {
            email: 'admin@sovi.gov.pk',
            password: await bcrypt.hash('admin123', 10),
            name: 'System Administrator',
            role: 'ADMIN' as const
        },
        {
            email: 'user@sovi.gov.pk',
            password: await bcrypt.hash('user123', 10),
            name: 'General User',
            role: 'USER' as const
        }
    ];

    for (const user of users) {
        await prisma.user.create({
            data: user
        });
    }

    console.log('✅ Users seeded');

    // Create districts
    const districts = [
        {
            name: 'Kasur',
            fid: 'district_boundary.101',
            division: 'Lahore_Division',
            province: 'Punjab',
            country: 'Pakistan'
        },
        {
            name: 'Rawalpindi',
            fid: 'district_boundary.102',
            division: 'Rawalpindi_Division',
            province: 'Punjab',
            country: 'Pakistan'
        },
        {
            name: 'Lahore',
            fid: 'district_boundary.103',
            division: 'Lahore_Division',
            province: 'Punjab',
            country: 'Pakistan'
        }
    ];

    for (const district of districts) {
        await prisma.district.create({
            data: district
        });
    }

    console.log('✅ Districts seeded');

    // Create sample SoVI data for Kasur
    const kasur = await prisma.district.findFirst({ where: { name: 'Kasur' } });

    if (kasur) {
        const soviData = {
            districtId: kasur.id,
            year: 2024,

            // Education
            NOSCL: 75,
            PRIMSC: 65,
            ENRLPR: 70,
            ENRMA: 60,
            PATS: 45,
            ADLLIT: 55,

            // Health
            DIARR: 30,
            IMMUN: 85,
            WTTI: 70,
            CbyladyH_W_PRE: 60,
            CbyladyH_W_POST: 55,
            PNCONSL: 65,
            FERTILITY: 3.2,
            CHDISABL: 5,

            // Facility
            TENURE: 60,
            ROOMS: 3.5,
            ELECTRIC: 85,
            TAPWATER: 70,
            MEDIA: 65,
            INTERNET: 45,

            // Economic
            QAGRI: 70,
            REMITT: 25,
            ECoH: 55,
            BHU_F: 65,
            Fmly_P: 60,
            Sch_F: 70,
            Vat_F: 40,
            Agro_F: 75,
            Pol_F: 50,

            // Population
            QOLD: 30,
            QMID: 55,
            Fpop: 48,
            Rpop: 60,
            Upop: 40,
            QKIDS: 50,
            Growth_Rate: 2.1
        };

        const calculatedScores = calculateScores(soviData);

        await prisma.districtData.create({
            data: {
                ...soviData,
                ...calculatedScores
            }
        });

        // Update district with scores
        await prisma.district.update({
            where: { id: kasur.id },
            data: {
                soviScore: calculatedScores.totalSoVI,
                rating: calculatedScores.rating
            }
        });

        console.log(`✅ SoVI data seeded for Kasur - Score: ${calculatedScores.totalSoVI}`);
    }

    console.log('🎉 Database seeding completed successfully!');
}

main()
    .catch((error) => {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });