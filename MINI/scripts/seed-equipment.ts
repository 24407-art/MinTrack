import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/mining_db?schema=public'
})

async function seedEquipment() {
  const client = await pool.connect()
  
  try {
    // Récupérer les IDs des sites
    const sitesResult = await client.query('SELECT id, name, code FROM "Site"')
    const sites = sitesResult.rows
    
    if (sites.length === 0) {
      console.log('No sites found. Please run seed-test-data.ts first.')
      return
    }
    
    console.log(`Found ${sites.length} sites`)
    
    // Vérifier s'il y a déjà des équipements
    const existingResult = await client.query('SELECT COUNT(*) FROM "Equipment"')
    const existingCount = parseInt(existingResult.rows[0].count)
    
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing equipment. Skipping...`)
      return
    }
    
    // Types d'équipements par site (basé sur le minerai)
    const equipmentTypes = [
      { name: "Camion Benne CAT 797F", type: "Camion", model: "CAT 797F", category: "transport" },
      { name: "Excavatrice Komatsu PC8000", type: "Excavatrice", model: "PC8000", category: "extraction" },
      { name: "Bulldozer CAT D11T", type: "Bulldozer", model: "CAT D11T", category: "terrassement" },
      { name: "Chargeuse Liebherr L586", type: "Chargeuse", model: "L586", category: "chargement" },
      { name: "Foreuse Atlas Copco D65", type: "Foreuse", model: "D65", category: "forage" },
      { name: "Niveleuse CAT 24M", type: "Niveleuse", model: "CAT 24M", category: "terrassement" },
      { name: "Camion Citerne Volvo FMX", type: "Citerne", model: "Volvo FMX", category: "support" },
      { name: "Grue Mobile Liebherr LTM", type: "Grue", model: "LTM 1200", category: "support" },
      { name: "Compresseur Atlas Copco", type: "Compresseur", model: "XRVS 1000", category: "support" },
      { name: "Drill Rig Sandvik", type: "Foreuse", model: "DR540", category: "forage" },
    ]
    
    const statuses = ['operational', 'operational', 'operational', 'maintenance', 'alert']
    
    let serialCounter = 100
    
    for (const site of sites) {
      // Ajouter 3-5 équipements par site
      const numEquipment = 3 + Math.floor(Math.random() * 3)
      
      for (let i = 0; i < numEquipment; i++) {
        const equipmentType = equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)]
        const status = statuses[Math.floor(Math.random() * statuses.length)]
        const serial = `SN-${serialCounter++}`
        
        // Date d'achat aléatoire (entre 2020 et 2024)
        const year = 2020 + Math.floor(Math.random() * 5)
        const month = 1 + Math.floor(Math.random() * 12)
        const day = 1 + Math.floor(Math.random() * 28)
        const purchaseDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
        
        // Dernière maintenance (entre 1 et 90 jours)
        const daysAgo = Math.floor(Math.random() * 90)
        const lastMaintenance = new Date()
        lastMaintenance.setDate(lastMaintenance.getDate() - daysAgo)
        
        await client.query(
          `INSERT INTO "Equipment" (name, type, model, serial, "siteId", status, "purchaseDate", "lastMaintenance", "updatedAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
          [equipmentType.name, equipmentType.type, equipmentType.model, serial, site.id, status, purchaseDate, lastMaintenance]
        )
        
        console.log(`Added ${equipmentType.name} to ${site.name}`)
      }
    }
    
    console.log('\nEquipment seeding completed!')
    
  } catch (error) {
    console.error('Error seeding equipment:', error)
  } finally {
    client.release()
    await pool.end()
  }
}

seedEquipment()
