import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/mining_db?schema=public'
})

async function seedSecurity() {
  const client = await pool.connect()
  
  try {
    // Vérifier si des incidents existent déjà
    const existing = await client.query('SELECT COUNT(*) FROM "Report" WHERE type = \'security\'')
    
    if (parseInt(existing.rows[0].count) > 0) {
      console.log(`${existing.rows[0].count} incidents existent déjà`)
      client.release()
      return
    }
    
    // Incidents de sécurité
    const incidents = [
      {
        title: "Éboulement zone B3",
        type: "security",
        description: "Éboulement mineur détecté dans la zone d'extraction B3. Évacuation préventive effectuée. Aucun blessé.",
        siteId: 2,
        date: "2026-03-25T09:15:00",
        status: "open",
        severity: "high",
        location: "Zone d'extraction B3",
        injuries: 0,
        damages: "Équipement mineur",
        reporter: "Ahmed Diallo"
      },
      {
        title: "Température excessive",
        type: "security",
        description: "Température ambiante dépassant 45°C. Rotation des équipes recommandée.",
        siteId: 2,
        date: "2026-03-25T08:30:00",
        status: "investigating",
        severity: "medium",
        location: "Zone générale",
        injuries: 0,
        damages: "Aucun",
        reporter: "Système automatique"
      },
      {
        title: "Panne système hydraulique",
        type: "security",
        description: "Fuite hydraulique détectée sur l'excavatrice PC8000. Maintenance en cours.",
        siteId: 2,
        date: "2026-03-24T14:20:00",
        status: "resolved",
        severity: "medium",
        location: "Excavatrice E-015",
        injuries: 0,
        damages: "Pièces à remplacer",
        reporter: "Moussa Kane"
      },
      {
        title: "Blessure légère opérateur",
        type: "security",
        description: "Coupure légère lors de manipulation d'outils. Premiers soins administrés.",
        siteId: 3,
        date: "2026-03-22T16:30:00",
        status: "closed",
        severity: "low",
        location: "Atelier maintenance",
        injuries: 1,
        damages: "Aucun",
        reporter: "Fatima Mint"
      }
    ]
    
    for (const incident of incidents) {
      await client.query(
        `INSERT INTO "Report" (title, type, content, "siteId", date, status, severity, location, injuries, damages, reporter, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())`,
        [
          incident.title,
          incident.type,
          incident.description,
          incident.siteId,
          incident.date,
          incident.status,
          incident.severity,
          incident.location,
          incident.injuries,
          incident.damages,
          incident.reporter
        ]
      )
      console.log(`✓ Incident ajouté: ${incident.title}`)
    }
    
    console.log(`\n✅ ${incidents.length} incidents ajoutés avec succès !`)
    
  } catch (error) {
    console.error('Erreur:', error)
  } finally {
    client.release()
    pool.end()
  }
}

seedSecurity()
