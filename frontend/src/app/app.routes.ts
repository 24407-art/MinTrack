import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './pages/auth/login/login.component';
import { LayoutComponent } from './core/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SitesComponent } from './pages/sites/sites.component';
import { SiteFormComponent } from './pages/sites/site-form/site-form.component';
import { PersonnelComponent } from './pages/personnel/personnel.component';
import { EquipmentComponent } from './pages/equipment/equipment.component';
import { ProductionComponent } from './pages/production/production.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { TeamsComponent } from './pages/teams/teams.component';
import { ShiftsComponent } from './pages/shifts/shifts.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'sites', component: SitesComponent },
      { path: 'sites/add', component: SiteFormComponent },
      { path: 'sites/edit/:id', component: SiteFormComponent },
      { path: 'personnel', component: PersonnelComponent },
      { path: 'equipment', component: EquipmentComponent },
      { path: 'production', component: ProductionComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'teams', component: TeamsComponent },
      { path: 'shifts', component: ShiftsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
