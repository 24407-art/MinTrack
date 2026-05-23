import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SiteService } from '../../../core/services/site.service';
import { Site } from '../../../core/models/site.model';

@Component({
  selector: 'app-site-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './site-form.component.html',
  styleUrls: ['./site-form.component.scss']
})
export class SiteFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  siteId?: number;
  loading = false;
  saving = false;
  error = '';
  success = '';

  statusOptions = [
    { value: 'active', label: 'Actif' },
    { value: 'inactive', label: 'Inactif' },
    { value: 'closed', label: 'Fermé' }
  ];

  mineralOptions = [
    'Or', 'Cuivre', 'Zinc', 'Plomb', 'Nickel', 'Cobalt', 'Manganèse', 'Autre'
  ];

  regionOptions = [
    'Adrar', 'Assaba', 'Brakna', 'Dakhlet Nouadhibou', 'Gorgol', 'Guidimaka', 'Hodh Ech Chargui', 'Hodh El Gharbi', 'Inchiri', 'Nouakchott', 'Tagant', 'Tiris Zemmour', 'Trarza'
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private siteService: SiteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.siteId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.siteId) {
      this.isEdit = true;
      this.loadSite();
    }
  }

  buildForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      code: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      mineral: ['', Validators.required],
      region: ['', Validators.required],
      coordinates: [''],
      status: ['active', Validators.required],
      capacity: [0, [Validators.required, Validators.min(0)]],
      currentProduction: [0, [Validators.required, Validators.min(0)]],
      workers: [0, [Validators.required, Validators.min(0)]],
      equipmentCount: [0, [Validators.required, Validators.min(0)]],
      startDate: [''],
      area: ['']
    });
  }

  loadSite(): void {
    this.loading = true;
    this.error = '';
    this.siteService.getById(this.siteId!).subscribe({
      next: (site) => {
        this.form.patchValue(site);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur de chargement du site';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.error = '';
    this.success = '';

    const data: Site = this.form.value;

    const request = this.isEdit
      ? this.siteService.update(this.siteId!, data)
      : this.siteService.create(data);

    request.subscribe({
      next: () => {
        this.success = this.isEdit ? 'Site modifié avec succès' : 'Site créé avec succès';
        this.saving = false;
        this.siteService.clearCache();
        setTimeout(() => this.router.navigate(['/sites']), 1200);
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors de l\'enregistrement';
        this.saving = false;
      }
    });
  }

  markAllAsTouched(): void {
    Object.values(this.form.controls).forEach(c => c.markAsTouched());
  }

  get f() {
    return this.form.controls;
  }

  cancel(): void {
    this.router.navigate(['/sites']);
  }
}
