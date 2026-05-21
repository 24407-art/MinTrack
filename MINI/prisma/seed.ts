import prisma from '../lib/db'

async function seedDatabase() {
  try {
    // Vérifier si des sites existent déjà
    const existingSites = await prisma.site.count()
    
    if (existingSites > 0) {
      console.log(`La base de données contient déjà ${existingSites} sites. Pas de seeding nécessaire.`)
      return
    }

    console.log('Seeding des données initiales...')

    // Créer les sites
    const sites = await Promise.all([
      prisma.site.create({
        data: {
          name: "Site de Zouérate",
          code: "ZRT-001",
          mineral: "Fer",
          region: "Tiris Zemmour",
          coordinates: "22.7306° N, 12.4713° W",
          status: "active",
          capacity: 6000,
          currentProduction: 4800,
          workers: 1250,
          equipmentCount: 28,
          startDate: "1963",
          area: "450 km²",
        }
      }),
      prisma.site.create({
        data: {
          name: "Site d'Akjoujt",
          code: "AKJ-002",
          mineral: "Or / Cuivre",
          region: "Inchiri",
          coordinates: "19.7500° N, 14.3833° W",
          status: "active",
          capacity: 120,
          currentProduction: 85,
          workers: 680,
          equipmentCount: 15,
          startDate: "2006",
          area: "180 km²",
        }
      }),
      prisma.site.create({
        data: {
          name: "Site de Tasiast",
          code: "TAS-003",
          mineral: "Or",
          region: "Inchiri",
          coordinates: "20.3333° N, 16.0833° W",
          status: "active",
          capacity: 110,
          currentProduction: 92,
          workers: 890,
          equipmentCount: 19,
          startDate: "2007",
          area: "320 km²",
        }
      }),
      prisma.site.create({
        data: {
          name: "Site de Nouadhibou",
          code: "NDB-004",
          mineral: "Cuivre",
          region: "Dakhlet Nouadhibou",
          coordinates: "20.9333° N, 17.0333° W",
          status: "maintenance",
          capacity: 400,
          currentProduction: 0,
          workers: 145,
          equipmentCount: 8,
          startDate: "2019",
          area: "95 km²",
        }
      })
    ])

    console.log(`✅ ${sites.length} sites créés avec succès`)

    // Créer quelques équipements
    const equipment = await Promise.all([
      prisma.equipment.create({
        data: {
          name: "Excavatrice CAT 349",
          type: "Excavation",
          model: "CAT 349F",
          serial: "CAT3492023001",
          siteId: sites[0].id,
          purchaseDate: "2023-01-15",
        }
      }),
      prisma.equipment.create({
        data: {
          name: "Camion BENZ 4050",
          type: "Transport",
          model: "Actros 4050",
          serial: "BENZ40502023001",
          siteId: sites[0].id,
          purchaseDate: "2023-02-20",
        }
      })
    ])

    console.log('Équipements créés:', equipment.length)

    // Créer quelques employés
    const personnel = await Promise.all([
      prisma.personnel.create({
        data: {
          firstName: "Mohamed",
          lastName: "Ould",
          email: "mohamed.ould@mining.com",
          phone: "+222 12345678",
          position: "Chef de site",
          department: "Management",
          siteId: sites[0].id,
          hireDate: "2020-03-15",
          salary: 150000.00,
        }
      }),
      prisma.personnel.create({
        data: {
          firstName: "Fatima",
          lastName: "Sall",
          email: "fatima.sall@mining.com",
          phone: "+222 87654321",
          position: "Ingénieur sécurité",
          department: "Sécurité",
          siteId: sites[0].id,
          hireDate: "2021-06-01",
          salary: 120000.00,
        }
      })
    ])

    console.log('Personnel créé:', personnel.length)

  } catch (error) {
    console.error('Erreur lors du seeding:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedDatabase()
