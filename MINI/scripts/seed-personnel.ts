import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/mining_db?schema=public'
})

async function seedPersonnel() {
  const client = await pool.connect()
  
  try {
    // Vérifier si des employés existent déjà
    const existing = await client.query('SELECT COUNT(*) FROM "Personnel"')
    
    if (parseInt(existing.rows[0].count) > 0) {
      console.log(`${existing.rows[0].count} employés existent déjà`)
    }
    
    // Employés à ajouter
    const employees = [
      // Site Zouérate (siteId: 2)
      { firstName: 'Mohamed', lastName: 'Ould Ahmed', email: 'mohamed.ahmed@minetrack.mr', phone: '+222 36 12 34 56', position: 'Opérateur Camion', department: 'transport', siteId: 2, hireDate: '2020-01-15', salary: 45000, status: 'active' },
      { firstName: 'Sidi', lastName: 'Ould Mohamed', email: 'sidi.mohamed@minetrack.mr', phone: '+222 36 23 45 67', position: 'Opérateur Chargeuse', department: 'transport', siteId: 2, hireDate: '2019-03-20', salary: 48000, status: 'active' },
      { firstName: 'Brahim', lastName: 'Ould Abdallah', email: 'brahim.abdallah@minetrack.mr', phone: '+222 36 34 56 78', position: 'Conducteur Camion Benne', department: 'transport', siteId: 2, hireDate: '2018-06-10', salary: 52000, status: 'active' },
      { firstName: 'Abdellahi', lastName: 'Ould Sidi', email: 'abdellahi.sidi@minetrack.mr', phone: '+222 36 45 67 89', position: 'Opérateur Foreuse', department: 'forage', siteId: 2, hireDate: '2021-02-01', salary: 55000, status: 'active' },
      { firstName: 'Dahi', lastName: 'Ould Moussa', email: 'dahi.moussa@minetrack.mr', phone: '+222 36 56 78 90', position: 'Technicien Maintenance', department: 'support', siteId: 2, hireDate: '2017-08-22', salary: 58000, status: 'active' },
      { firstName: 'Moussa', lastName: 'Ould Dahi', email: 'moussa.dahi@minetrack.mr', phone: '+222 36 67 89 01', position: 'Chef d\'équipe', department: 'extraction', siteId: 2, hireDate: '2015-11-05', salary: 75000, status: 'active' },
      { firstName: 'Ali', lastName: 'Ould Mohamed', email: 'ali.mohamed@minetrack.mr', phone: '+222 36 78 90 12', position: 'Opérateur Bulldozer', department: 'terrassement', siteId: 2, hireDate: '2019-09-14', salary: 50000, status: 'active' },
      { firstName: 'Ahmed', lastName: 'Ould Brahim', email: 'ahmed.brahim@minetrack.mr', phone: '+222 36 89 01 23', position: 'Conducteur Niveleuse', department: 'transport', siteId: 2, hireDate: '2020-04-30', salary: 53000, status: 'active' },
      { firstName: 'Omar', lastName: 'Ould Sidi', email: 'omar.sidi@minetrack.mr', phone: '+222 37 01 23 45', position: 'Opérateur Grue', department: 'support', siteId: 2, hireDate: '2018-12-18', salary: 56000, status: 'active' },
      { firstName: 'Lamine', lastName: 'Ould Fall', email: 'lamine.fall@minetrack.mr', phone: '+222 37 12 34 56', position: 'Ingenieur Mine', department: 'extraction', siteId: 2, hireDate: '2016-07-01', salary: 95000, status: 'active' },
      
      // Site Akjoujt (siteId: 3)
      { firstName: 'Samba', lastName: 'Thiam', email: 'samba.thiam@minetrack.mr', phone: '+222 38 23 45 67', position: 'Opérateur Camion', department: 'transport', siteId: 3, hireDate: '2020-02-20', salary: 46000, status: 'active' },
      { firstName: 'Issa', lastName: 'Ba', email: 'issa.ba@minetrack.mr', phone: '+222 38 34 56 78', position: 'Opérateur Chargeuse', department: 'transport', siteId: 3, hireDate: '2019-05-15', salary: 49000, status: 'active' },
      { firstName: 'Mamadou', lastName: 'Diop', email: 'mamadou.diop@minetrack.mr', phone: '+222 38 45 67 89', position: 'Conducteur Camion Citerne', department: 'transport', siteId: 3, hireDate: '2018-09-10', salary: 51000, status: 'active' },
      { firstName: 'Cheikh', lastName: 'Gueye', email: 'cheikh.gueye@minetrack.mr', phone: '+222 38 56 78 90', position: 'Opérateur Excavatrice', department: 'extraction', siteId: 3, hireDate: '2021-01-10', salary: 54000, status: 'active' },
      { firstName: 'Babacar', lastName: 'Ndiaye', email: 'babacar.ndiaye@minetrack.mr', phone: '+222 38 67 89 01', position: 'Technicien Électrique', department: 'support', siteId: 3, hireDate: '2017-03-22', salary: 57000, status: 'active' },
      { firstName: 'Youssouf', lastName: 'Sow', email: 'youssouf.sow@minetrack.mr', phone: '+222 38 78 90 12', position: 'Chef d\'équipe Forage', department: 'forage', siteId: 3, hireDate: '2014-11-12', salary: 78000, status: 'active' },
      { firstName: 'Ibrahima', lastName: 'Diallo', email: 'ibrahima.diallo@minetrack.mr', phone: '+222 38 89 01 23', position: 'Opérateur Compresseur', department: 'forage', siteId: 3, hireDate: '2019-07-08', salary: 47000, status: 'active' },
      { firstName: 'Pape', lastName: 'Seck', email: 'pape.seck@minetrack.mr', phone: '+222 39 01 23 45', position: 'Mécanicien', department: 'support', siteId: 3, hireDate: '2016-04-18', salary: 59000, status: 'active' },
      { firstName: 'Modou', lastName: 'Fall', email: 'modou.fall@minetrack.mr', phone: '+222 39 12 34 56', position: 'Opérateur Foreuse', department: 'forage', siteId: 3, hireDate: '2020-08-05', salary: 56000, status: 'active' },
      { firstName: 'Adama', lastName: 'Ba', email: 'adama.ba@minetrack.mr', phone: '+222 39 23 45 67', position: 'Surveillant', department: 'extraction', siteId: 3, hireDate: '2018-01-25', salary: 62000, status: 'active' },
    ]
    
    let count = 0
    for (const emp of employees) {
      // Vérifier si l'email existe déjà
      const check = await client.query('SELECT id FROM "Personnel" WHERE email = $1', [emp.email])
      
      if (check.rows.length === 0) {
        await client.query(
          `INSERT INTO "Personnel" ("firstName", "lastName", email, phone, position, department, "siteId", "hireDate", salary, status, "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())`,
          [emp.firstName, emp.lastName, emp.email, emp.phone, emp.position, emp.department, emp.siteId, emp.hireDate, emp.salary, emp.status]
        )
        count++
        console.log(`✓ Ajouté: ${emp.firstName} ${emp.lastName} - ${emp.position}`)
      } else {
        console.log(`✗ Déjà existant: ${emp.email}`)
      }
    }
    
    console.log(`\n✅ ${count} employés ajoutés avec succès !`)
    console.log(`📊 Total: ${parseInt(existing.rows[0].count) + count} employés dans la base`)
    
  } catch (error) {
    console.error('Erreur:', error)
  } finally {
    client.release()
    pool.end()
  }
}

seedPersonnel()
