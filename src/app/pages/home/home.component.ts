import { Component } from '@angular/core';
import { JornadaResponse } from '../../model/JornadaResponse';
import { JornadaService } from '../../services/jornada.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';

@Component({
  selector: 'app-home',
    imports: [
    CommonModule,
    NzCardModule,
    NzGridModule,
    NzIconModule,
    NzEmptyModule,
    NzTimelineModule,
    NzSpinModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less'
})
export class HomeComponent {

carregando = false;
  jornada: JornadaResponse = new JornadaResponse();
  erro!: string

  constructor(
    private readonly jornadaService: JornadaService,
    private readonly message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.carregarJornadaAtual();
  }

  carregarJornadaAtual(): void {
    this.carregando = true;
    this.jornadaService.buscarJornadaAtual().subscribe({
      next: (response) => {
        this.jornada = response;
        this.carregando = false;
      },
      error: (error) => {
        this.erro = 'Não foi possível carregar a jornada atual.';
        this.message.error(this.erro);
        console.error('Erro ao carregar jornada:', error);
        this.carregando = false;
      }
    });
  }
  formatarDuracao(duracao: string): string {
    if (!duracao) return '0min';

    // Trata o caso especial PT0S (zero segundos)
    if (duracao === 'PT0S') return '0min';

    let resultado = '';

    // Extrai horas (se houver)
    const horasMatch = duracao.match(/(\d+)H/);
    if (horasMatch && horasMatch[1]) {
      resultado += `${horasMatch[1]}h `;
    }

    // Extrai minutos (se houver)
    const minutosMatch = duracao.match(/(\d+)M/);
    if (minutosMatch && minutosMatch[1]) {
      resultado += `${minutosMatch[1]}min`;
    } else if (resultado.length === 0) {
      // Se não tem horas nem minutos, verifica se tem segundos
      const segundosMatch = duracao.match(/(\d+)S/);
      if (segundosMatch && segundosMatch[1]) {
        return `${segundosMatch[1]}s`;
      }
      // Se chegou aqui e não encontrou nada, retorna zero minutos
      return '0min';
    }

    return resultado.trim();
  }
}
