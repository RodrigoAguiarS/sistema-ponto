import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CargoService } from '../../../services/cargo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NgxCurrencyDirective } from 'ngx-currency';

@Component({
  selector: 'app-cargo-delete',
    imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzInputNumberModule,
    NgxCurrencyDirective,
    NzSpinModule,
    NzCardModule,
  ],
  templateUrl: './cargo-delete.component.html',
  styleUrl: './cargo-delete.component.less',
})
export class CargoDeleteComponent {
  cargoForm!: FormGroup;
  carregando = false;
  id!: number;

  constructor(
    private readonly message: NzMessageService,
    private readonly cargoService: CargoService,
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.iniciarForm();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.iniciarForm();
    this.carregarTipos();
  }

  private carregarTipos(): void {
    this.carregando = true;
    this.cargoService.findById(this.id).subscribe({
      next: (cargo) => {
        this.cargoForm.patchValue(cargo);
        this.cargoForm.disable();
      },
      error: (ex) => {
        this.message.error(ex.error.message);
        this.carregando = false;
      },
      complete: () => (this.carregando = false),
    });
  }

  delete(): void {
    this.carregando = true;
    this.cargoForm.value.id = this.id;
    this.cargoService.delete(this.cargoForm.value.id).subscribe({
      next: () => {
        this.message.success('Tipo Produto foi desativado com sucesso!');
        this.router.navigate(['/cargos/list']);
      },
      error: (ex) => {
        if (ex.error.errors) {
          ex.error.errors.forEach((element: ErrorEvent) => {
            this.message.error(element.message);
            this.carregando = false;
          });
        } else {
          this.message.error(ex.error.message);
          this.carregando = false;
        }
      },
      complete: () => {
        this.carregando = false;
      },
    });
  }

  private iniciarForm(): void {
    this.cargoForm = this.formBuilder.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      ativo: [false, Validators.required],
      salarioBase: [null, [Validators.required, Validators.min(0)]],
      nivelHierarquia: [
        null,
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
    });
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}
