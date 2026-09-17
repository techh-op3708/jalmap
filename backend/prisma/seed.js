import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const states = [
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    lat: 19.7515,
    lng: 75.7139,
    overallRisk: 'Moderate',
    cities: [
      {
        cityName: 'Mumbai',
        district: 'Mumbai',
        lat: 19.076,
        lng: 72.8777,
        source: 'Mixed',
        tds: 420,
        ph: 7.2,
        turbidity: 2.8,
        fluoride: 0.3,
        nitrate: 12,
        arsenic: 0.005,
        risk: 'Moderate',
        reason: 'Ageing pipe network and monsoon turbidity spikes.',
        contaminants: ['Turbidity', 'OldPipes'],
        updatedAt: new Date('2025-03-14'),
      },
      {
        cityName: 'Pune',
        district: 'Pune',
        lat: 18.5204,
        lng: 73.8567,
        source: 'River',
        tds: 380,
        ph: 7.5,
        turbidity: 0.9,
        fluoride: 0.4,
        nitrate: 18,
        arsenic: 0.003,
        risk: 'Safe',
        reason: 'Modern reservoir treatment keeps supply within BIS limits.',
        contaminants: [],
        updatedAt: new Date('2025-03-14'),
      },
    ],
  },
  {
    id: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    lat: 26.8467,
    lng: 80.9462,
    overallRisk: 'Contaminated',
    cities: [
      {
        cityName: 'Kanpur',
        district: 'Kanpur Nagar',
        lat: 26.4499,
        lng: 80.3319,
        source: 'River',
        tds: 720,
        ph: 7.6,
        turbidity: 4.5,
        fluoride: 0.6,
        nitrate: 52,
        arsenic: 0.04,
        risk: 'Critical',
        reason: 'Industrial discharge and elevated arsenic in the river basin.',
        contaminants: ['IndustrialWaste', 'Arsenic', 'Nitrate'],
        updatedAt: new Date('2025-03-12'),
      },
    ],
  },
  {
    id: 'delhi',
    name: 'Delhi',
    lat: 28.7041,
    lng: 77.1025,
    overallRisk: 'Contaminated',
    cities: [
      {
        cityName: 'West Delhi',
        district: 'West Delhi',
        lat: 28.6439,
        lng: 77.0833,
        source: 'Groundwater',
        tds: 820,
        ph: 8.0,
        turbidity: 1.7,
        fluoride: 1.4,
        nitrate: 56,
        arsenic: 0.022,
        risk: 'Critical',
        reason: 'Groundwater is degraded by industrial effluent and poor treatment.',
        contaminants: ['IndustrialWaste', 'Fluoride', 'Nitrate'],
        updatedAt: new Date('2025-03-15'),
      },
    ],
  },
];

async function main() {
  for (const state of states) {
    await prisma.state.upsert({
      where: { id: state.id },
      update: {
        name: state.name,
        lat: state.lat,
        lng: state.lng,
        overallRisk: state.overallRisk,
      },
      create: {
        id: state.id,
        name: state.name,
        lat: state.lat,
        lng: state.lng,
        overallRisk: state.overallRisk,
      },
    });

    for (const city of state.cities) {
      await prisma.city.upsert({
        where: {
          id: -1,
        },
        update: {},
        create: {
          stateId: state.id,
          cityName: city.cityName,
          district: city.district,
          lat: city.lat,
          lng: city.lng,
          source: city.source,
          tds: city.tds,
          ph: city.ph,
          turbidity: city.turbidity,
          fluoride: city.fluoride,
          nitrate: city.nitrate,
          arsenic: city.arsenic,
          risk: city.risk,
          reason: city.reason,
          contaminants: city.contaminants,
          updatedAt: city.updatedAt,
        },
      });
    }
  }

  console.log('Seed data created successfully');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
