import { Component } from '@angular/core';
import { UsuarioResponse } from '../../../model/UsuarioResponse';
import { PerfilResponse } from '../../../model/PerfilResponse';
import { CargoResponse } from '../../../model/CargoResponse';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { PerfilService } from '../../../services/perfil.service';
import { CargoService } from '../../../services/cargo.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AlertaService } from '../../../services/alerta.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { CPFPipe, TelefonePipe } from '../../../../pipe';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-usuario-list',
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzSpinModule,
    NzSelectModule,
    NzPaginationModule,
    RouterModule,
    NzTagModule,
    TelefonePipe,
    NgxMaskDirective,
    CPFPipe,
    NzPopconfirmModule,
    NzAlertModule,
    NzInputNumberModule,
    NzFormModule,
    NzInputModule,
  ],
  templateUrl: './usuario-list.component.html',
  styleUrl: './usuario-list.component.less',
})
export class UsuarioListComponent {
  usuarios: UsuarioResponse[] = [];
  perfis: PerfilResponse[] = [];
  cargos: CargoResponse[] = [];
  filtroForm!: FormGroup;
  carregando = false;
  totalElementos = 0;
  itensPorPagina = 10;
  paginaAtual = 1;
  modalVisible = false;
  descricaoCompleta = '';
  nenhumResultadoEncontrado = false;

  constructor(
    private readonly tipoService: UsuarioService,
    private readonly formBuilder: FormBuilder,
    private readonly perfilService: PerfilService,
    private readonly cargoService: CargoService,
    private readonly message: NzMessageService,
    public readonly alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.filtroForm = this.formBuilder.group({
      id: [''],
      nome: [''],
      email: [''],
      telefone: [''],
      cpf: [''],
      perfil: [null],
      cargo: [null],
    });
    this.alertaService.limparAlerta();
    this.buscarUsuarios();
    this.carregarPerfis();
    this.carregarCargos();
  }

  private carregarPerfis(): void {
    this.perfilService.findAll().subscribe({
      next: (perfis) => {
        this.perfis = perfis;
      },
      error: (ex) => {
        this.message.error(ex.error.message);
      },
    });
  }

  private carregarCargos(): void {
    this.cargoService.findAll().subscribe({
      next: (cargos) => {
        this.cargos = cargos;
      },
      error: (ex) => {
        this.message.error(ex.error.message);
      },
    });
  }

  buscarUsuarios(): void {
    this.carregando = true;
    const params = {
      ...this.filtroForm.value,
      page: this.paginaAtual - 1,
      size: this.itensPorPagina,
      nome: this.filtroForm.get('nome')?.value.trim().toLowerCase() ?? '',
      cpf: this.filtroForm.get('cpf')?.value.trim().toLowerCase() ?? '',
      email: this.filtroForm.get('email')?.value.trim().toLowerCase() ?? '',
    };
    this.tipoService.buscarPaginado(params).subscribe({
      next: (response) => {
        this.usuarios = response.content;
        console.log(response);
        this.nenhumResultadoEncontrado = this.usuarios.length === 0;
        this.totalElementos = response.page.totalElements;
        this.carregando = false;
        if (this.nenhumResultadoEncontrado) {
          this.alertaService.mostrarAlerta(
            'info',
            'Nenhum resultado encontrado.'
          );
        } else {
          this.alertaService.limparAlerta();
        }
      },
      error: (ex) => {
        this.message.error(ex.error.message);
        this.carregando = false;
      },
    });
  }

  cancel(): void {
    this.message.info('Ação Cancelada');
  }

  aoMudarPagina(pageIndex: number): void {
    this.paginaAtual = pageIndex;
    this.buscarUsuarios();
  }
}
