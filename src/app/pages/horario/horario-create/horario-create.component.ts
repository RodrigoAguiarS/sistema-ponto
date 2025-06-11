import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { UsuarioResponse } from '../../../model/UsuarioResponse';
import { HorarioTrabalhoResponse } from '../../../model/HorarioTrabalhoResponse';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { HorarioTrabalhoService } from '../../../services/horario-trabalho.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DiaSemana } from '../../../model/DiaSemana';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { ACESSO } from '../../../model/Acesso';

@Component({
  selector: 'app-horario-create',
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
    NzDescriptionsModule,
    NzPopconfirmModule,
    NzEmptyModule,
    NzModalModule,
    NzFormModule,
    NzSelectModule,
    NzTimePickerModule,
    NzGridModule,
    NzCheckboxModule,
  ],
  templateUrl: './horario-create.component.html',
  styleUrl: './horario-create.component.less',
})
export class HorarioCreateComponent {
  usuarioLogado: UsuarioResponse = new UsuarioResponse();
  roles: string[] = [];
  Acesso = ACESSO;
  usuario: UsuarioResponse = new UsuarioResponse();
  horarios: HorarioTrabalhoResponse[] = [];
  carregando = false;
  isModalVisible = false;
  isSubmitting = false;
  horarioForm!: FormGroup;
  usuarioId!: number;
  horarioEmEdicao: HorarioTrabalhoResponse | null = null;
  modalTitle = 'Adicionar Horário de Trabalho';
  diasSemana = Object.values(DiaSemana);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly usuarioService: UsuarioService,
    private readonly horarioService: HorarioTrabalhoService,
    private readonly fb: FormBuilder,
    private readonly message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.usuarioId = +params['id'];
      this.carregarUsuario();
      this.carregarHorarios();
      this.carregarUsuarioLogado();
    });
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    const horaInicio = new Date();
    horaInicio.setHours(8, 0, 0);

    const horaFim = new Date();
    horaFim.setHours(17, 0, 0);

    this.horarioForm = this.fb.group({
      id: [null],
      diaSemana: [DiaSemana.MONDAY, Validators.required],
      horaInicio: [horaInicio, Validators.required],
      horaFim: [horaFim, Validators.required],
      ativo: [true],
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
    this.usuarioService.findById(this.usuarioId).subscribe({
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

  carregarHorarios(): void {
    this.carregando = true;
    this.horarioService.findByUsuarioId(this.usuarioId).subscribe({
      next: (horarios) => {
        this.horarios = horarios;
        this.carregando = false;
      },
      error: (error) => {
        this.message.error(error.error.message);
        this.carregando = false;
      },
    });
  }

  showModal(): void {
    this.horarioEmEdicao = null;
    this.modalTitle = 'Adicionar Horário de Trabalho';
    this.inicializarFormulario();
    this.isModalVisible = true;
  }

  editarHorario(horario: HorarioTrabalhoResponse): void {
    this.horarioEmEdicao = horario;
    this.modalTitle = 'Editar Horário de Trabalho';
    const horaInicioPartes = horario.horaInicio.split(':');
    const horaFimPartes = horario.horaFim.split(':');

    const horaInicioDate = new Date();
    horaInicioDate.setHours(
      +horaInicioPartes[0],
      +horaInicioPartes[1],
      horaInicioPartes.length > 2 ? +horaInicioPartes[2] : 0
    );

    const horaFimDate = new Date();
    horaFimDate.setHours(
      +horaFimPartes[0],
      +horaFimPartes[1],
      horaFimPartes.length > 2 ? +horaFimPartes[2] : 0
    );

    this.horarioForm.patchValue({
      id: horario.id,
      diaSemana: horario.diaSemana,
      horaInicio: horaInicioDate,
      horaFim: horaFimDate,
      ativo: horario.ativo,
    });

    this.isModalVisible = true;
  }

  excluirHorario(id?: number): void {
    if (!id) return;

    this.carregando = true;
    this.horarioService.delete(id).subscribe({
      next: () => {
        this.message.success('Horário excluído com sucesso');
        this.carregarHorarios();
      },
      error: (error) => {
        this.message.error(error.error.message);
        this.carregando = false;
      },
    });
  }

  handleOk(): void {
    if (this.horarioForm.invalid) {
      Object.values(this.horarioForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      });
      return;
    }

    this.isSubmitting = true;

    const formValue = this.horarioForm.value;

    const horaInicio =
      formValue.horaInicio instanceof Date
        ? `${formValue.horaInicio
            .getHours()
            .toString()
            .padStart(2, '0')}:${formValue.horaInicio
            .getMinutes()
            .toString()
            .padStart(2, '0')}`
        : formValue.horaInicio;

    const horaFim =
      formValue.horaFim instanceof Date
        ? `${formValue.horaFim
            .getHours()
            .toString()
            .padStart(2, '0')}:${formValue.horaFim
            .getMinutes()
            .toString()
            .padStart(2, '0')}`
        : formValue.horaFim;

    const horario: HorarioTrabalhoResponse = {
      ...formValue,
      horaInicio,
      horaFim,
      usuarioId: this.usuarioId,
    };

    const operation = this.horarioEmEdicao
      ? this.horarioService.update(horario)
      : this.horarioService.create(horario);

    operation.subscribe({
      next: () => {
        this.message.success(
          `Horário ${
            this.horarioEmEdicao ? 'atualizado' : 'adicionado'
          } com sucesso`
        );
        this.isModalVisible = false;
        this.isSubmitting = false;
        this.carregarHorarios();
      },
      error: (error) => {
        console.error('Erro ao salvar horário:', error);
        this.message.error(error.error.message);
        this.isSubmitting = false;
      },
    });
  }

  handleCancel(): void {
    this.isModalVisible = false;
  }

  cancel(): void {
    this.message.info('Operação cancelada');
  }

  traduzirDiaSemana(dia: DiaSemana): string {
    const traducoes: Record<DiaSemana, string> = {
      [DiaSemana.MONDAY]: 'Segunda-feira',
      [DiaSemana.TUESDAY]: 'Terça-feira',
      [DiaSemana.WEDNESDAY]: 'Quarta-feira',
      [DiaSemana.THURSDAY]: 'Quinta-feira',
      [DiaSemana.FRIDAY]: 'Sexta-feira',
      [DiaSemana.SATURDAY]: 'Sábado',
      [DiaSemana.SUNDAY]: 'Domingo',
    };

    return traducoes[dia] || dia;
  }
}
