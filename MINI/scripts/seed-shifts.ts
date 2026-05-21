import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/mining_db?schema=public'
})

async function seedShifts() {
  const client = await pool.connect()
  
  try {
    // Vérifier si des shifts existent déjà
    const existing = await client.query('SELECT COUNT(*) FROM "Shift"')
    
    if (parseInt(existing.rows[0].count) > 0) {
      console.log('Shifts already exist, skipping...')
      client.release()
      return
    }
    
    // Créer les shifts
    const shifts = [
      { name: 'Équipe Matin', startTime: '06:00', endTime: '14:00', workers: 145, status: 'active', sites: [1, 2] },
      { name: 'Équipe Après-midi', startTime: '14:00', endTime: '22:00', workers: 138, status: 'upcoming', sites: [1, 2] },
      { name: 'Équipe Nuit', startTime: '22:00', endTime: '06:00', workers: 112, status: 'upcoming', sites: [3] }
    ]
    
    for (const shift of shifts) {
      const shiftResult = await client.query(
        `INSERT INTO "Shift" (name, "startTime", "endTime", workers, status, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
         RETURNING id`,
        [shift.name, shift.startTime, shift.endTime, shift.workers, shift.status]
      )
      
      const shiftId = shiftResult.rows[0].id
      
      // Associer les sites
      for (const siteId of shift.sites) {
        await client.query(
          `INSERT INTO "ShiftSite" ("shiftId", "siteId", "createdAt") VALUES ($1, $2, NOW())`,
          [shiftId, siteId]
        )
      }
      
      console.log(`Created shift: ${shift.name}`)
    }
    
    console.log('Shifts seeded successfully!')
  } catch (error) {
    console.error('Error seeding shifts:', error)
  } finally {
    client.release()
    pool.end()
  }
}

seedShifts()
