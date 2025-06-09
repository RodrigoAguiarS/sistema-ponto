import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PerfilService } from '../../../services/perfil.service';
import { Router } from '@angular/router';
import { PerfilResponse } from '../../../model/PerfilResponse';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';

const ROUTES = {
  HOME: '/home',
  RESULT: '/result',
  PERFIS_CREATE: '/perfis/create',
  PERFIS_LIST: '/perfis/list',
};

@Component({
  selector: 'app-perfil-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSpinModule,
    NzCheckboxModule,
    NzCardModule,
  ],
  templateUrl: './perfil-create.component.html',
  styleUrl: './perfil-create.component.less',
})
export class PerfilCreateComponent {
  perfilForm!: FormGroup;
  carregando = false;

  constructor(
    private readonly message: NzMessageService,
    private readonly perfilService: PerfilService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  criar(): void {
    if (this.perfilForm.invalid) {
      this.markFormGroupTouched(this.perfilForm);
      return;
    }

    this.carregando = true;
    const novoPerfil: PerfilResponse = this.perfilForm.value;

    this.perfilService
      .create(novoPerfil)
      .pipe(finalize(() => (this.carregando = false)))
      .subscribe({
        next: (resposta: PerfilResponse) => {
          this.navegarParaResultado(resposta);
        },
        error: (erro) => this.tratarErro(erro),
      });
  }

  cancelar(): void {
    this.router.navigate([ROUTES.HOME]);
  }

  private initForm(): void {
    this.perfilForm = this.formBuilder.group({
      nome: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      descricao: ['', [Validators.required, Validators.maxLength(255)]],
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
        erro.error?.message ?? 'Ocorreu um erro ao criar o perfil'
      );
    }
  }

  private navegarParaResultado(perfil: PerfilResponse): void {
    this.router.navigate([ROUTES.RESULT], {
      queryParams: {
        type: 'success',
        title: `O Perfil - ${perfil.nome}`,
        message: 'foi criado com sucesso!',
        createRoute: ROUTES.PERFIS_CREATE,
        listRoute: ROUTES.PERFIS_LIST,
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
