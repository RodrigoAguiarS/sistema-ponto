import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { ACESSO } from '../../../model/Acesso';
import { RegistroPontoResponse } from '../../../model/RegistroPontoResponse';
import { TipoRegistro } from '../../../model/TipoRegistro';
import { UsuarioResponse } from '../../../model/UsuarioResponse';
import { RegistroPontoService } from '../../../services/registro-ponto.service';
import { UsuarioService } from '../../../services/usuario.service';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@Component({
  selector: 'app-registro-ponto-manual',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzTableModule,
    NzDividerModule,
    NzTagModule,
    NzSpinModule,
    DatePipe,
    NzPopconfirmModule,
    NzDescriptionsModule,
    NzModalModule,
    NzFormModule,
    NzSelectModule,
    NzTimePickerModule,
    NzDatePickerModule,
    NzGridModule,
  ],
  templateUrl: './registro-ponto-manual.component.html',
  styleUrl: './registro-ponto-manual.component.less',
})
export class RegistroPontoManualComponent {
  usuarioLogado: UsuarioResponse = new UsuarioResponse();
  roles: string[] = [];
  Acesso = ACESSO;
  usuario: UsuarioResponse = new UsuarioResponse();
  registrosPonto: RegistroPontoResponse[] = [];
  carregando = false;
  isModalVisible = false;
  isSubmitting = false;
  pontoForm!: FormGroup;
  idUsuario!: number;
  tiposRegistro = Object.values(TipoRegistro);
  paginaAtual = 1;
  itensPorPagina = 10;
  totalElementos = 0;

  // Propriedade para registro em edição
  registroEmEdicao: RegistroPontoResponse | null = null;
  modalTitle = 'Adicionar Registro de Ponto Manual';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly usuarioService: UsuarioService,
    private readonly registroPontoService: RegistroPontoService,
    private readonly fb: FormBuilder,
    private readonly message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.idUsuario = +params['id'];
      this.carregarUsuario();
      this.carregarRegistrosPonto();
      this.carregarUsuarioLogado();
    });
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    const dataHoraAtual = new Date();

    this.pontoForm = this.fb.group({
      dataHora: [dataHoraAtual, Validators.required],
      tipo: [TipoRegistro.ENTRADA, Validators.required],
      observacao: ['INSERIDO MANUALMENTE', Validators.required],
    });
  }

  private carregarUsuarioLogado(): void {
    this.usuarioService.usuarioLogado().subscribe({
      next: (usuario) => {
        this.usuarioLogado = usuario;
        this.roles = usuario.perfis.map((perfil) => perfil.nome);
      },
      error: (ex) => {
        this.message.error(ex.error.message);
      },
    });
  }

  carregarUsuario(): void {
    this.carregando = true;
    this.usuarioService.findById(this.idUsuario).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.carregando = false;
      },
      error: (error) => {
        this.message.error(error.error.message);
        this.carregando = false;
      },
    });
  }

  carregarRegistrosPonto(): void {
    this.carregando = true;
    this.registroPontoService
      .buscarRegistrosPorUsuario({
        page: this.paginaAtual - 1,
        size: this.itensPorPagina,
        idUsuario: this.idUsuario,
        ativo: true,
      })
      .subscribe({
        next: (response) => {
          this.registrosPonto = response.content;
          this.totalElementos = response.page.totalElements;
          this.carregando = false;
        },
        error: (error) => {
          this.message.error(error.error.message);
          this.carregando = false;
        },
      });
  }

  aoMudarPagina(pagina: number): void {
    this.paginaAtual = pagina;
    this.carregarRegistrosPonto();
  }

  showModal(): void {
    this.registroEmEdicao = null;
    this.modalTitle = 'Adicionar Registro de Ponto Manual';
    this.inicializarFormulario();
    this.isModalVisible = true;
  }

  editarRegistro(registro: RegistroPontoResponse): void {
    this.registroEmEdicao = registro;
    this.modalTitle = 'Editar Registro de Ponto';

    const dataHora = new Date(registro.dataHora);

    this.pontoForm.patchValue({
      id: registro.id,
      tipo: registro.tipo,
      dataHora: dataHora,
      observacao: registro.observacao || 'INSERIDO MANUALMENTE'
    });

    this.isModalVisible = true;
  }

  excluirRegistro(id?: number): void {
    if (!id) return;
    console.error('Excluindo registro de ponto com ID:', id);
    this.carregando = true;
    this.registroPontoService.delete(id).subscribe({
      next: () => {
        this.message.success('Registro de ponto excluído com sucesso');
        this.carregarRegistrosPonto();
      },
      error: (error) => {
        this.message.error(error.error.message);
        this.carregando = false;
      }
    });
  }

  cancel(): void {
    this.message.info('Operação cancelada');
  }

  handleOk(): void {
    if (this.pontoForm.invalid) {
      Object.values(this.pontoForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      });
      return;
    }

    this.isSubmitting = true;

    const formValue = this.pontoForm.value;
    let dataHora;

    if (formValue.dataHora instanceof Date) {
      const ano = formValue.dataHora.getFullYear();
      const mes = formValue.dataHora.getMonth();
      const dia = formValue.dataHora.getDate();
      const hora = formValue.dataHora.getHours();
      const minuto = formValue.dataHora.getMinutes();
      const segundo = formValue.dataHora.getSeconds();
      dataHora = `${ano}-${(mes + 1).toString().padStart(2, '0')}-${dia
        .toString()
        .padStart(2, '0')}T${hora.toString().padStart(2, '0')}:${minuto
        .toString()
        .padStart(2, '0')}:${segundo.toString().padStart(2, '0')}`;
    } else {
      dataHora = formValue.dataHora;
    }

    const registro = {
      idRegistro: this.registroEmEdicao ? this.registroEmEdicao.id : null,
      idUsuario: this.idUsuario,
      dataHora: dataHora,
      tipo: formValue.tipo,
      observacao: formValue.observacao,
    };

    this.registroPontoService.registrarPontoManual(registro).subscribe({
      next: () => {
        this.message.success('Registro de ponto adicionado com sucesso');
        this.isModalVisible = false;
        this.isSubmitting = false;
        this.carregarRegistrosPonto();
      },
      error: (error) => {
        console.error('Erro ao salvar registro de ponto:', error);
        this.message.error(error.error.message);
        this.isSubmitting = false;
      },
    });
  }

  handleCancel(): void {
    this.isModalVisible = false;
  }

  getTipoDisplay(tipo: string): string {
    return tipo === TipoRegistro.ENTRADA ? 'Entrada' : 'Saída';
  }
}
