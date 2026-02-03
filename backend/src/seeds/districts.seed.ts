import prisma from '../config/database';

const districts = [
    // Punjab
    { name: 'Lahore', fid: 'district_boundary.1', division: 'Lahore', province: 'Punjab', country: 'Pakistan' },
    { name: 'Rawalpindi', fid: 'district_boundary.2', division: 'Rawalpindi', province: 'Punjab', country: 'Pakistan' },
    { name: 'Faisalabad', fid: 'district_boundary.3', division: 'Faisalabad', province: 'Punjab', country: 'Pakistan' },
    { name: 'Multan', fid: 'district_boundary.4', division: 'Multan', province: 'Punjab', country: 'Pakistan' },
    { name: 'Gujranwala', fid: 'district_boundary.5', division: 'Gujranwala', province: 'Punjab', country: 'Pakistan' },
    { name: 'Sargodha', fid: 'district_boundary.6', division: 'Sargodha', province: 'Punjab', country: 'Pakistan' },
    { name: 'Bahawalpur', fid: 'district_boundary.7', division: 'Bahawalpur', province: 'Punjab', country: 'Pakistan' },
    { name: 'Sahiwal', fid: 'district_boundary.8', division: 'Sahiwal', province: 'Punjab', country: 'Pakistan' },
    { name: 'Kasur', fid: 'district_boundary.9', division: 'Lahore', province: 'Punjab', country: 'Pakistan' },
    { name: 'Gujrat', fid: 'district_boundary.10', division: 'Gujrat', province: 'Punjab', country: 'Pakistan' },

    // Sindh
    { name: 'Karachi', fid: 'district_boundary.11', division: 'Karachi', province: 'Sindh', country: 'Pakistan' },
    { name: 'Hyderabad', fid: 'district_boundary.12', division: 'Hyderabad', province: 'Sindh', country: 'Pakistan' },
    { name: 'Sukkur', fid: 'district_boundary.13', division: 'Sukkur', province: 'Sindh', country: 'Pakistan' },
    { name: 'Larkana', fid: 'district_boundary.14', division: 'Larkana', province: 'Sindh', country: 'Pakistan' },

    // Khyber Pakhtunkhwa
    { name: 'Peshawar', fid: 'district_boundary.15', division: 'Peshawar', province: 'Khyber Pakhtunkhwa', country: 'Pakistan' },
    { name: 'Mardan', fid: 'district_boundary.16', division: 'Mardan', province: 'Khyber Pakhtunkhwa', country: 'Pakistan' },
    { name: 'Abbottabad', fid: 'district_boundary.17', division: 'Hazara', province: 'Khyber Pakhtunkhwa', country: 'Pakistan' },
    { name: 'Swat', fid: 'district_boundary.18', division: 'Malakand', province: 'Khyber Pakhtunkhwa', country: 'Pakistan' },

    // Balochistan
    { name: 'Quetta', fid: 'district_boundary.19', division: 'Quetta', province: 'Balochistan', country: 'Pakistan' },
    { name: 'Khuzdar', fid: 'district_boundary.20', division: 'Khuzdar', province: 'Balochistan', country: 'Pakistan' },

    // Gilgit-Baltistan
    { name: 'Gilgit', fid: 'district_boundary.21', division: 'Gilgit', province: 'Gilgit-Baltistan', country: 'Pakistan' },
    { name: 'Skardu', fid: 'district_boundary.22', division: 'Baltistan', province: 'Gilgit-Baltistan', country: 'Pakistan' },

    // Azad Jammu & Kashmir
    { name: 'Muzaffarabad', fid: 'district_boundary.23', division: 'Muzaffarabad', province: 'Azad Jammu & Kashmir', country: 'Pakistan' },
    { name: 'Mirpur', fid: 'district_boundary.24', division: 'Mirpur', province: 'Azad Jammu & Kashmir', country: 'Pakistan' }
];

export async function seedDistricts() {
    console.log('Seeding districts...');

    for (const districtData of districts) {
        await prisma.district.upsert({
            where: { name: districtData.name },
            update: {},
            create: districtData
        });

        console.log(`District seeded: ${districtData.name}`);
    }

    console.log('Districts seeding completed!');
}