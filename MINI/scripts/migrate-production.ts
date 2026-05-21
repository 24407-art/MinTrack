import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/mining_db?schema=public'
})

async function migrateProduction() {
  const client = await pool.connect()
  
  try {
    console.log('Migration des données de production...')
    
    // Récupérer tous les sites avec leur production
    const sitesResult = await client.query(
      `SELECT id, name, "currentProduction", capacity, mineral FROM "Site" WHERE "currentProduction" > 0`
    )
    
    console.log(`${sitesResult.rows.length} sites trouvés avec production > 0`)
    
    let inserted = 0
    
    for (const site of sitesResult.rows) {
      // Vérifier si une production existe déjà pour aujourd'hui
      const existing = await client.query(
        `SELECT id FROM "Production" WHERE "siteId" = $1 AND date::date = CURRENT_DATE`,
        [site.id]
      )
      
      if (existing.rows.length === 0) {
        // Créer une entrée de production pour aujourd'hui
        await client.query(
          `INSERT INTO "Production" ("siteId", date, target, actual, unit, notes, "createdAt", "updatedAt")
           VALUES ($1, NOW(), $2, $3, $4, $5, NOW(), NOW())`,
          [
            site.id,
            site.capacity || 0,  // target = capacité
            site.currentProduction,  // actual = production actuelle
            'tonnes',
            `Migration automatique - Production ${site.mineral}`
          ]
        )
        inserted++
        console.log(`✅ ${site.name}: ${site.currentProduction} tonnes ajoutées`)
      } else {
        console.log(`⚠️  ${site.name}: Production déjà existante pour aujourd'hui`)
      }
    }
    
    console.log(`\n🎉 Migration terminée: ${inserted} entrées créées`)
    
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    client.release()
    await pool.end()
  }
}

migrateProduction()
