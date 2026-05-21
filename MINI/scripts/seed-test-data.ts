import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/mining_db?schema=public'
})

async function seedTestData() {
  const client = await pool.connect()
  
  try {
    console.log('🌱 Ajout de sites de test et données de production...\n')
    
    // Sites à ajouter
    const sites = [
      {
        name: "Site de Fderik",
        code: "FDR-005",
        mineral: "Fer",
        region: "Tiris Zemmour",
        coordinates: "22.6789° N, 12.3456° W",
        capacity: 3500,
        currentProduction: 2800,
        workers: 890,
        equipmentCount: 22,
        status: "active",
        startDate: "1975",
        area: "320 km²"
      },
      {
        name: "Site de M'Haoudat",
        code: "MHD-006",
        mineral: "Fer",
        region: "Tiris Zemmour",
        coordinates: "22.8901° N, 12.5678° W",
        capacity: 2000,
        currentProduction: 1650,
        workers: 650,
        equipmentCount: 18,
        status: "active",
        startDate: "2012",
        area: "280 km²"
      },
      {
        name: "Site de Guelb Moghrein",
        code: "GMO-007",
        mineral: "Cuivre / Or",
        region: "Inchiri",
        coordinates: "19.4567° N, 14.2345° W",
        capacity: 80,
        currentProduction: 65,
        workers: 420,
        equipmentCount: 12,
        status: "active",
        startDate: "2006",
        area: "150 km²"
      },
      {
        name: "Site de Boiné",
        code: "BOI-008",
        mineral: "Or",
        region: "Dakhlet Nouadhibou",
        coordinates: "21.1234° N, 16.7890° W",
        capacity: 25,
        currentProduction: 0,
        workers: 180,
        equipmentCount: 6,
        status: "maintenance",
        startDate: "2018",
        area: "85 km²"
      },
      {
        name: "Site de Kaédi",
        code: "KAE-009",
        mineral: "Phosphate",
        region: "Gorgol",
        coordinates: "16.4567° N, 13.3456° W",
        capacity: 500,
        currentProduction: 380,
        workers: 320,
        equipmentCount: 9,
        status: "active",
        startDate: "2020",
        area: "120 km²"
      },
      {
        name: "Site de Néma",
        code: "NEM-010",
        mineral: "Or",
        region: "Hodh Ech Chargui",
        coordinates: "16.6789° N, 7.1234° W",
        capacity: 45,
        currentProduction: 38,
        workers: 280,
        equipmentCount: 8,
        status: "active",
        startDate: "2015",
        area: "200 km²"
      }
    ]
    
    const insertedSites: { id: number; name: string; capacity: number; currentProduction: number; mineral: string }[] = []
    
    // Insérer les sites
    for (const site of sites) {
      // Vérifier si le site existe déjà
      const existing = await client.query(
        'SELECT id FROM "Site" WHERE code = $1',
        [site.code]
      )
      
      if (existing.rows.length === 0) {
        const result = await client.query(
          `INSERT INTO "Site" (name, code, mineral, region, coordinates, capacity, "currentProduction", workers, "equipmentCount", status, "startDate", area, "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
           RETURNING id`,
          [
            site.name,
            site.code,
            site.mineral,
            site.region,
            site.coordinates,
            site.capacity,
            site.currentProduction,
            site.workers,
            site.equipmentCount,
            site.status,
            site.startDate,
            site.area
          ]
        )
        
        insertedSites.push({
          id: result.rows[0].id,
          name: site.name,
          capacity: site.capacity,
          currentProduction: site.currentProduction,
          mineral: site.mineral
        })
        console.log(`✅ ${site.name} créé`)
      } else {
        // Récupérer l'ID du site existant
        const existingSite = await client.query(
          'SELECT id, name, capacity, "currentProduction", mineral FROM "Site" WHERE code = $1',
          [site.code]
        )
        insertedSites.push(existingSite.rows[0])
        console.log(`⚠️  ${site.name} existe déjà`)
      }
    }
    
    console.log(`\n📊 Ajout des données de production journalière...\n`)
    
    // Générer 15 jours de données de production pour chaque site
    const today = new Date()
    let totalProductions = 0
    
    for (const site of insertedSites) {
      // Supprimer les productions existantes pour ce site (pour éviter les doublons)
      await client.query('DELETE FROM "Production" WHERE "siteId" = $1', [site.id])
      
      for (let i = 14; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        
        // Variation aléatoire de la production (±20%)
        const variation = 0.8 + Math.random() * 0.4
        const actual = Math.round(site.currentProduction * variation)
        const target = site.capacity
        
        await client.query(
          `INSERT INTO "Production" ("siteId", date, target, actual, unit, notes, "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
          [
            site.id,
            date,
            target,
            actual,
            site.mineral.includes('Or') || site.mineral.includes('Cuivre') ? 'kg' : 'tonnes',
            `Production du ${date.toLocaleDateString('fr-FR')}`
          ]
        )
        
        totalProductions++
      }
      console.log(`📈 ${site.name}: 15 jours de production ajoutés`)
    }
    
    console.log(`\n🎉 Terminé!`)
    console.log(`   ${insertedSites.length} sites`)
    console.log(`   ${totalProductions} entrées de production`)
    
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    client.release()
    await pool.end()
  }
}

seedTestData()
