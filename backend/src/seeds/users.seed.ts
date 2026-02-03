import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const users = [
    {
        email: 'admin@sovi.gov.pk',
        password: 'admin123',
        name: 'System Administrator',
        role: 'ADMIN' as const
    },
    {
        email: 'analyst@sovi.gov.pk',
        password: 'analyst123',
        name: 'Data Analyst',
        role: 'USER' as const
    },
    {
        email: 'viewer@sovi.gov.pk',
        password: 'viewer123',
        name: 'Data Viewer',
        role: 'USER' as const
    },
    {
        email: 'provincial@sovi.gov.pk',
        password: 'provincial123',
        name: 'Provincial Coordinator',
        role: 'USER' as const
    }
];

export async function seedUsers() {
    console.log('Seeding users...');

    for (const userData of users) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        await prisma.user.upsert({
            where: { email: userData.email },
            update: {},
            create: {
                email: userData.email,
                password: hashedPassword,
                name: userData.name,
                role: userData.role
            }
        });

        console.log(`User seeded: ${userData.email}`);
    }

    console.log('Users seeding completed!');
}