import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { Subscription, interval } from 'rxjs';
import { RegistroPontoResponse } from '../../../model/RegistroPontoResponse';
import { UsuarioResponse } from '../../../model/UsuarioResponse';
import { RegistroPontoService } from '../../../services/registro-ponto.service';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-registro-ponto-create',
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzSpinModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzAlertModule,
    NzTableModule,
    NzEmptyModule,
    NzTagModule,
  ],
  templateUrl: './registro-ponto-create.component.html',
  styleUrl: './registro-ponto-create.component.less',
})
export class RegistroPontoCreateComponent {
   usuarioLogado: UsuarioResponse | null = null;

  dataAtual = new Date();
  horaAtual = '';
  relogioSubscription: Subscription | null = null;

  registrosHoje: RegistroPontoResponse[] = [];
  ultimoRegistro: RegistroPontoResponse | null = null;
  carregando = false;

  isModalVisible = false;
  enviandoRegistro = false;
  observacao = '';

  get ultimaAcaoFormatada(): string {
    if (!this.ultimoRegistro) return '';
    const horario = new Date(this.ultimoRegistro.dataHora)
      .toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'});
    const tipo = this.ultimoRegistro.tipo === 'ENTRADA' ? 'Entrada' : 'Saída';
    return `${tipo} às ${horario}`;
  }

  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly registroPontoService: RegistroPontoService,
    private readonly message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.iniciarRelogio();
    this.carregarUsuarioLogado();
    this.carregarRegistrosDeHoje();
  }

  ngOnDestroy(): void {
    if (this.relogioSubscription) {
      this.relogioSubscription.unsubscribe();
    }
  }

  iniciarRelogio(): void {
    // Atualiza o relógio a cada segundo
    this.atualizarHora();
    this.relogioSubscription = interval(1000).subscribe(() => {
      this.atualizarHora();
    });
  }

  atualizarHora(): void {
    const agora = new Date();
    this.horaAtual = agora.toLocaleTimeString();
    this.dataAtual = agora;
  }

  carregarUsuarioLogado(): void {
    this.carregando = true;
    this.usuarioService.usuarioLogado().subscribe({
      next: (usuario) => {
        this.usuarioLogado = usuario;
        this.carregando = false;
      },
      error: (erro) => {
        this.message.error('Erro ao carregar dados do usuário');
        console.error('Erro ao carregar usuário:', erro);
        this.carregando = false;
      }
    });
  }

  carregarRegistrosDeHoje(): void {
    this.carregando = true;
    this.registroPontoService.buscarRegistrosDeHoje().subscribe({
      next: (registros) => {
        this.registrosHoje = registros;
        this.ultimoRegistro = registros.length > 0 ? registros[registros.length - 1] : null;
        this.carregando = false;
      },
      error: (erro) => {
        this.message.error('Erro ao carregar registros de ponto');
        console.error('Erro ao carregar registros:', erro);
        this.carregando = false;
      }
    });
  }

  abrirModalRegistro(): void {
    this.observacao = '';
    this.isModalVisible = true;
  }

  cancelarRegistro(): void {
    this.isModalVisible = false;
  }

  confirmarRegistro(): void {
    this.enviandoRegistro = true;
    const payload = { observacao: this.observacao };

    this.registroPontoService.registrarPonto(payload).subscribe({
      next: () => {
        this.message.success('Registro realizado com sucesso!');
        this.isModalVisible = false;
        this.enviandoRegistro = false;
        this.carregarRegistrosDeHoje();
      },
      error: (erro) => {
        this.message.error(erro.error.message);
        this.enviandoRegistro = false;
      }
    });
  }
}
