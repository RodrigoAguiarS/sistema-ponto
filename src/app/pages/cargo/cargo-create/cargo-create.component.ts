import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CargoService } from '../../../services/cargo.service';
import { Router } from '@angular/router';
import { CargoResponse } from '../../../model/CargoResponse';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NgxCurrencyDirective } from 'ngx-currency';

const ROUTES = {
  HOME: '/home',
  RESULT: '/result',
  CARGOS_CREATE: '/cargos/create',
  CARGOS_LIST: '/cargos/list',
};


@Component({
  selector: 'app-cargo-create',
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
  templateUrl: './cargo-create.component.html',
  styleUrl: './cargo-create.component.less',
})
export class CargoCreateComponent {
  cargoForm!: FormGroup;
  carregando = false;

  constructor(
    private readonly message: NzMessageService,
    private readonly cargoService: CargoService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  criar(): void {
    if (this.cargoForm.invalid) {
      this.markFormGroupTouched(this.cargoForm);
      return;
    }

    this.carregando = true;
    const novoCargo: CargoResponse = this.cargoForm.value;

    this.cargoService
      .create(novoCargo)
      .pipe(finalize(() => (this.carregando = false)))
      .subscribe({
        next: (resposta: CargoResponse) => {
          this.navegarParaResultado(resposta);
        },
        error: (erro) => this.tratarErro(erro),
      });
  }

  cancelar(): void {
    this.router.navigate([ROUTES.HOME]);
  }

  private initForm(): void {
    this.cargoForm = this.formBuilder.group({
      nome: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      descricao: ['', [Validators.required, Validators.maxLength(255)]],
      salarioBase: [null, [Validators.required, Validators.min(0)]],
      nivelHierarquia: [
        null,
        [Validators.required, Validators.min(1), Validators.max(10)],
      ],
      ativo: [true, Validators.required],
    });
  }

  private tratarErro(erro: any): void {
    if (erro.error?.errors?.length) {
      erro.error.errors.forEach((element: { message: string }) => {
        this.message.error(element.message);
      });
    } else {
      this.message.error(
        erro.error?.message ?? 'Ocorreu um erro ao criar o cargo'
      );
    }
  }

  private navegarParaResultado(cargo: CargoResponse): void {
    this.router.navigate([ROUTES.RESULT], {
      queryParams: {
        type: 'success',
        title: `O Cargo - ${cargo.nome}`,
        message: 'foi criado com sucesso!',
        createRoute: ROUTES.CARGOS_CREATE,
        listRoute: ROUTES.CARGOS_LIST,
      },
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
