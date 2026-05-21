# Diagramme de Classes - Système de Gestion Minière

## Diagramme Mermaid

```mermaid
classDiagram
    class Site {
        +Int id PK
        +String name
        +String code UK
        +String mineral
        +String region
        +String coordinates
        +String status
        +Int capacity
        +Int currentProduction
        +Int workers
        +Int equipmentCount
        +String startDate
        +String area
        +DateTime createdAt
        +DateTime updatedAt
    }

    class Personnel {
        +Int id PK
        +String firstName
        +String lastName
        +String email UK
        +String phone
        +String position
        +String role
        +String department
        +Int siteId FK
        +Int teamId FK
        +String hireDate
        +Decimal salary
        +String status
        +DateTime createdAt
        +DateTime updatedAt
    }

    class Team {
        +Int id PK
        +String name
        +String code UK
        +Int siteId FK
        +String department
        +Int shiftId
        +Int chefId
        +Int adjointId
        +String status
        +DateTime createdAt
        +DateTime updatedAt
    }

    class Equipment {
        +Int id PK
        +String name
        +String type
        +String model
        +String serial UK
        +Int siteId FK
        +String status
        +String purchaseDate
        +DateTime lastMaintenance
        +DateTime createdAt
        +DateTime updatedAt
    }

    class Production {
        +Int id PK
        +Int siteId FK
        +DateTime date
        +Int target
        +Int actual
        +String unit
        +String notes
        +DateTime createdAt
        +DateTime updatedAt
    }

    class Report {
        +Int id PK
        +String title
        +String type
        +String content
        +Int siteId FK
        +Int authorId
        +DateTime date
        +String status
        +DateTime createdAt
        +DateTime updatedAt
    }

    class Shift {
        +Int id PK
        +String name
        +String startTime
        +String endTime
        +Int workers
        +String status
        +DateTime createdAt
        +DateTime updatedAt
    }

    class ShiftSite {
        +Int id PK
        +Int shiftId FK
        +Int siteId FK
        +DateTime createdAt
    }

    class PersonnelSchedule {
        +Int id PK
        +Int personnelId FK
        +DateTime weekStart
        +String monday
        +String tuesday
        +String wednesday
        +String thursday
        +String friday
        +String saturday
        +String sunday
        +DateTime createdAt
        +DateTime updatedAt
    }

    Site "1" --> "*" Personnel : contient
    Site "1" --> "*" Equipment : possède
    Site "1" --> "*" Production : génère
    Site "1" --> "*" Report : reçoit
    Site "1" --> "*" Team : héberge
    Site "1" --> "*" ShiftSite : associe
    
    Team "1" --> "*" Personnel : regroupe
    Shift "1" --> "*" ShiftSite : assigne
    
    Personnel "1" --> "*" PersonnelSchedule : planifie
```

---

## Détail des Tables et Attributs

### 1. **Site** (Sites Minières)
| Attribut | Type | Contrainte | Description |
|----------|------|------------|-------------|
| `id` | Int | PK, auto | Identifiant unique |
| `name` | String | - | Nom du site |
| `code` | String | UK | Code unique (ex: MFN001) |
| `mineral` | String | - | Type de minerai |
| `region` | String | - | Région géographique |
| `coordinates` | String | - | Coordonnées GPS |
| `status` | String | default("active") | Statut (active/inactive) |
| `capacity` | Int | - | Capacité de production |
| `currentProduction` | Int | default(0) | Production actuelle |
| `workers` | Int | default(0) | Nombre d'ouvriers |
| `equipmentCount` | Int | default(0) | Nombre d'équipements |
| `startDate` | String | - | Date de démarrage |
| `area` | String | - | Superficie |
| `createdAt` | DateTime | default(now) | Date de création |
| `updatedAt` | DateTime | updatedAt | Date de modification |

### 2. **Personnel** (Employés)
| Attribut | Type | Contrainte | Description |
|----------|------|------------|-------------|
| `id` | Int | PK, auto | Identifiant unique |
| `firstName` | String | - | Prénom |
| `lastName` | String | - | Nom de famille |
| `email` | String | UK | Email unique |
| `phone` | String | nullable | Téléphone |
| `position` | String | - | Poste (chef, adjoint, ouvrier) |
| `role` | String | default("ouvrier") | Rôle (chef_equipe, adjoint, ouvrier) |
| `department` | String | - | Département |
| `siteId` | Int | FK → Site.id | Site d'affectation |
| `teamId` | Int | FK → Team.id, nullable | Équipe |
| `hireDate` | String | - | Date d'embauche |
| `salary` | Decimal | nullable | Salaire |
| `status` | String | default("active") | Statut |
| `createdAt` | DateTime | default(now) | Date de création |
| `updatedAt` | DateTime | updatedAt | Date de modification |

### 3. **Team** (Équipes)
| Attribut | Type | Contrainte | Description |
|----------|------|------------|-------------|
| `id` | Int | PK, auto | Identifiant unique |
| `name` | String | - | Nom de l'équipe |
| `code` | String | UK | Code unique |
| `siteId` | Int | FK → Site.id | Site d'affectation |
| `department` | String | - | Département |
| `shiftId` | Int | nullable | Quart de travail |
| `chefId` | Int | nullable | Chef d'équipe |
| `adjointId` | Int | nullable | Adjoint |
| `status` | String | default("active") | Statut |
| `createdAt` | DateTime | default(now) | Date de création |
| `updatedAt` | DateTime | updatedAt | Date de modification |

### 4. **Equipment** (Équipements)
| Attribut | Type | Contrainte | Description |
|----------|------|------------|-------------|
| `id` | Int | PK, auto | Identifiant unique |
| `name` | String | - | Nom de l'équipement |
| `type` | String | - | Type (engin, outil, etc.) |
| `model` | String | nullable | Modèle |
| `serial` | String | UK, nullable | Numéro de série |
| `siteId` | Int | FK → Site.id | Site d'affectation |
| `status` | String | default("operational") | Statut (operational/maintenance) |
| `purchaseDate` | String | nullable | Date d'achat |
| `lastMaintenance` | DateTime | nullable | Dernière maintenance |
| `createdAt` | DateTime | default(now) | Date de création |
| `updatedAt` | DateTime | updatedAt | Date de modification |

### 5. **Production** (Données de Production)
| Attribut | Type | Contrainte | Description |
|----------|------|------------|-------------|
| `id` | Int | PK, auto | Identifiant unique |
| `siteId` | Int | FK → Site.id | Site concerné |
| `date` | DateTime | - | Date de production |
| `target` | Int | - | Objectif |
| `actual` | Int | - | Production réelle |
| `unit` | String | default("tonnes") | Unité de mesure |
| `notes` | String | nullable | Notes |
| `createdAt` | DateTime | default(now) | Date de création |
| `updatedAt` | DateTime | updatedAt | Date de modification |

### 6. **Report** (Rapports/Incidents)
| Attribut | Type | Contrainte | Description |
|----------|------|------------|-------------|
| `id` | Int | PK, auto | Identifiant unique |
| `title` | String | - | Titre du rapport |
| `type` | String | - | Type (security, production, etc.) |
| `content` | String | - | Contenu |
| `siteId` | Int | FK → Site.id, nullable | Site concerné |
| `authorId` | Int | nullable | Auteur |
| `date` | DateTime | - | Date du rapport |
| `status` | String | default("draft") | Statut |
| `createdAt` | DateTime | default(now) | Date de création |
| `updatedAt` | DateTime | updatedAt | Date de modification |

### 7. **Shift** (Quarts de Travail)
| Attribut | Type | Contrainte | Description |
|----------|------|------------|-------------|
| `id` | Int | PK, auto | Identifiant unique |
| `name` | String | - | Nom (Matin, Après-midi, Nuit) |
| `startTime` | String | - | Heure de début |
| `endTime` | String | - | Heure de fin |
| `workers` | Int | default(0) | Nombre d'ouvriers |
| `status` | String | default("active") | Statut |
| `createdAt` | DateTime | default(now) | Date de création |
| `updatedAt` | DateTime | updatedAt | Date de modification |

### 8. **ShiftSite** (Association Shift-Site)
| Attribut | Type | Contrainte | Description |
|----------|------|------------|-------------|
| `id` | Int | PK, auto | Identifiant unique |
| `shiftId` | Int | FK → Shift.id | Quart de travail |
| `siteId` | Int | FK → Site.id | Site |
| `createdAt` | DateTime | default(now) | Date de création |
| **Contrainte** | UK(shiftId, siteId) | - | Unique par combinaison |

### 9. **PersonnelSchedule** (Planning du Personnel)
| Attribut | Type | Contrainte | Description |
|----------|------|------------|-------------|
| `id` | Int | PK, auto | Identifiant unique |
| `personnelId` | Int | FK → Personnel.id | Employé |
| `weekStart` | DateTime | - | Début de semaine |
| `monday` | String | nullable | Lundi (matin/apresmidi/nuit/none) |
| `tuesday` | String | nullable | Mardi |
| `wednesday` | String | nullable | Mercredi |
| `thursday` | String | nullable | Jeudi |
| `friday` | String | nullable | Vendredi |
| `saturday` | String | nullable | Samedi |
| `sunday` | String | nullable | Dimanche |
| `createdAt` | DateTime | default(now) | Date de création |
| `updatedAt` | DateTime | updatedAt | Date de modification |
| **Contrainte** | UK(personnelId, weekStart) | - | Unique par employé/semaine |

---

## Relations entre Tables

| Relation | Cardinalité | Description |
|----------|-------------|-------------|
| **Site → Personnel** | 1..* | Un site contient plusieurs employés |
| **Site → Equipment** | 1..* | Un site possède plusieurs équipements |
| **Site → Production** | 1..* | Un site génère plusieurs enregistrements de production |
| **Site → Report** | 1..* | Un site reçoit plusieurs rapports |
| **Site → Team** | 1..* | Un site héberge plusieurs équipes |
| **Site → ShiftSite** | 1..* | Un site est associé à plusieurs quarts |
| **Team → Personnel** | 1..* | Une équipe regroupe plusieurs employés |
| **Shift → ShiftSite** | 1..* | Un quart est associé à plusieurs sites |
| **Personnel → PersonnelSchedule** | 1..* | Un employé a plusieurs plannings |

---

## Légende
- **PK** = Primary Key (Clé primaire)
- **FK** = Foreign Key (Clé étrangère)
- **UK** = Unique Key (Contrainte d'unicité)
- **nullable** = Champ optionnel (peut être NULL)
- **default** = Valeur par défaut
