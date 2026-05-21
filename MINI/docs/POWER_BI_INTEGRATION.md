# Intégration Power BI - Guide Complet

## 🎯 3 Méthodes pour intégrer Power BI à votre Dashboard

---

## Méthode 1: Power BI Embedded (Recommandée)
Intégrer des rapports Power BI directement dans votre application Next.js.

### Étapes:

1. **Obtenir les identifiants Power BI:**
   - Allez sur https://app.powerbi.com
   - Ouvrez votre rapport
   - Cliquez sur Fichier > Intégrer dans SharePoint/Teams
   - Copiez l'**URL d'intégration**

2. **Utiliser le composant créé:**

```tsx
// Dans votre page dashboard (app/page.tsx)
import { PowerBIEmbedded, PowerBILink } from "@/components/mining/powerbi-embedded"

// Ajoutez cette carte dans votre dashboard
<PowerBIEmbedded 
  reportId="votre-report-id"
  embedUrl="https://app.powerbi.com/reportEmbed?reportId=..."
  title="Analyse Production - Power BI"
/>
```

3. **Pour une intégration avancée avec SDK:**
```bash
npm install powerbi-client
```

---

## Méthode 2: Connecteur PostgreSQL (Power BI Desktop)
Connecter Power BI Desktop directement à votre base de données.

### Étapes:

1. **Ouvrir Power BI Desktop**
2. **Cliquer sur "Obtenir les données" > Base de données PostgreSQL**
3. **Entrer les paramètres de connexion:**
   - Serveur: `localhost:5432` (ou votre serveur)
   - Base de données: `mining_db`
   - Mode de connectivité: Importer

4. **Entrer les identifiants:**
   - Nom d'utilisateur: `postgres`
   - Mot de passe: `password`

5. **Sélectionner les tables:**
   - `"Production"`
   - `"Equipment"`
   - `"Personnel"`
   - `"Report"`
   - `"Site"`
   - `"Shift"`

6. **Créer vos visualisations et publier:**
   - Power BI Service > Publier
   - Obtenir l'URL d'intégration

---

## Méthode 3: API REST (Web Data Source)
Utiliser l'API créée pour alimenter Power BI.

### Étapes:

1. **Dans Power BI Desktop:**
   - Obtenir les données > Web

2. **Entrer l'URL de l'API:**
   ```
   http://localhost:3000/api/powerbi?type=all
   ```

3. **Pour des données spécifiques:**
   - Production: `/api/powerbi?type=production`
   - Équipements: `/api/powerbi?type=equipment`
   - Personnel: `/api/powerbi?type=personnel`
   - Incidents: `/api/powerbi?type=incidents`
   - Quarts: `/api/powerbi?type=shifts`

4. **Transformer les données:**
   ```powerquery
   let
       Source = Json.Document(Web.Contents("http://localhost:3000/api/powerbi?type=production")),
       Production = Source[production]
   in
       Production
   ```

---

## 📊 Visualisations Recommandées pour Power BI

### Pour la Production:
- Graphique en aires: Évolution de la production
- Carte thermique: Production par site et par jour
- Jauge: Objectif vs Réel

### Pour les Équipements:
- Graphique en barres: Taux d'utilisation par équipement
- Indicateur: Équipements actifs/en panne
- Graphique circulaire: Répartition par type

### Pour le Personnel:
- Graphique en barres: Personnel par site
- Indicateur: Total des employés actifs
- Graphique circulaire: Répartition par département

### Pour les Incidents:
- Graphique en ligne: Tendance des incidents
- Matrice: Incidents par gravité et statut
- Carte: Localisation géographique

---

## 🔗 Exemple d'intégration dans votre Dashboard

```tsx
// app/page.tsx
import { PowerBIEmbedded } from "@/components/mining/powerbi-embedded"

// Dans votre return, ajoutez:
<div className="grid gap-6 lg:grid-cols-2">
  {/* Vos composants existants */}
  <ProductionChart data={productionChart} />
  
  {/* Nouveau: Rapport Power BI */}
  <PowerBIEmbedded 
    reportId="12345678-1234-1234-1234-123456789abc"
    embedUrl="https://app.powerbi.com/reportEmbed?reportId=12345678-1234-1234-1234-123456789abc"
    accessToken="votre-token-jwt"
    title="Analyse Avancée Production"
  />
</div>
```

---

## 🎓 Formation Power BI Recommandée

### Tutoriels Microsoft:
- https://docs.microsoft.com/power-bi/
- Power BI Embedded: https://docs.microsoft.com/power-bi/developer/embedded/

### Fonctionnalités avancées:
- **Row-Level Security (RLS)**: Données filtrées par utilisateur
- **DirectQuery**: Données en temps réel
- **Power Automate**: Workflows automatisés
- **Alertes**: Notifications sur seuils

---

## 💡 Conseils Pro

1. **Performance**: Utilisez DirectQuery pour les données temps réel
2. **Cache**: Activez le cache pour les rapports fréquemment consultés
3. **Sécurité**: Configurez RLS pour limiter l'accès aux données
4. **Mobile**: Optimisez les rapports pour mobile
5. **Export**: Permettez l'export PDF/Excel depuis Power BI

---

## 🚀 Prochaines Étapes

1. Installer Power BI Desktop (gratuit)
2. Se connecter à votre base PostgreSQL
3. Créer un premier rapport avec les données de production
4. Publier sur Power BI Service
5. Intégrer l'URL dans votre dashboard Next.js

**Besoin d'aide ?** N'hésitez pas à demander !
