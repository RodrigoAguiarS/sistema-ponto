import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CargoResponse } from '../../../model/CargoResponse';
import { PerfilResponse } from '../../../model/PerfilResponse';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UsuarioService } from '../../../services/usuario.service';
import { CargoService } from '../../../services/cargo.service';
import { PerfilService } from '../../../services/perfil.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NgxMaskDirective } from 'ngx-mask';
import { TipoVinculo } from '../../../model/TipoVinculo';

@Component({
  selector: 'app-usuario-update',
      imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzCardModule,
    NzSpinModule,
    NzGridModule,
    NgxMaskDirective,
    NzDatePickerModule
  ],
  templateUrl: './usuario-update.component.html',
  styleUrl: './usuario-update.component.less'
})
export class UsuarioUpdateComponent {
usuarioForm!: FormGroup;
  cargos: CargoResponse[] = [];
  perfis: PerfilResponse[] = [];
  tiposVinculo: string[] = Object.values(TipoVinculo);
  carregando = false;
  id!: number;

  constructor(
    private readonly message: NzMessageService,
    private readonly usuarioService: UsuarioService,
    private readonly cargoService: CargoService,
    private readonly perfilService: PerfilService,
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.initForm();
    this.carregarUsuario();
    this.carregarPerfis();
    this.carregarUnidades();
  }

  update(): void {
    if (this.usuarioForm.valid) {
      this.usuarioForm.value.id = this.id;
      this.usuarioService.update(this.usuarioForm.value).subscribe({
        next: (resposta) => {
          console.log(resposta);
          this.router.navigate(['/result'], {
            queryParams: {
              type: 'success',
              title: 'Usuário de nome - ' + resposta.pessoa.nome,
              message: 'Foi atualizado com sucesso!',
              createRoute: '/usuarios/create',
              listRoute: '/usuarios/list',
            },
          });
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
  }

  private carregarUsuario(): void {
    this.carregando = true;
    this.usuarioService.findById(this.id).subscribe({
      next: (usuario) => {
        console.log(usuario);
        this.usuarioForm.patchValue({
          id: usuario.id,
          email: usuario.email,
          senha: '',
          perfil: usuario.perfis[0]?.id,
          dataNascimento: usuario.pessoa.dataNascimento,
          cpf: usuario.pessoa.cpf,
          vinculo: usuario.vinculo.tipo,
          cargo: usuario.cargo?.id,
          nome: usuario.pessoa.nome,
          telefone: usuario.pessoa.telefone,
        });
      },
      complete: () => {
        this.carregando = false;
      },
    });
  }

  private carregarUnidades(): void {
    this.carregando = true;
    this.cargoService.findAll().subscribe({
      next: (response) => {
        this.cargos = response;
      },
      error: (ex) => {
        this.message.error(ex.error.message);
        this.carregando = false;
      },
      complete: () => {
        this.carregando = false;
      },
    });
  }

  private carregarPerfis(): void {
    this.carregando = true;
    this.perfilService.findAll().subscribe({
      next: (response) => {
        this.perfis = response;
      },
      error: (ex) => {
        this.message.error(ex.error.message);
        this.carregando = false;
      },
      complete: () => {
        this.carregando = false;
      },
    });
  }

  private initForm(): void {
    this.usuarioForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.maxLength(50)]],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(100)],
      ],
      senha: ['', [Validators.required, Validators.minLength(3)]],
      telefone: ['', Validators.required],
      perfil: [null, Validators.required],
      cargo: [null, Validators.required],
      vinculo: [null, Validators.required],
      cpf: ['', Validators.required],
      dataNascimento: ['', Validators.required],
    });
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}

