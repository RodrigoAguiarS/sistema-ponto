import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ACESSO } from '../../model/Acesso';
import { StateService } from '../../services/state.service';
import { UsuarioResponse } from '../../model/UsuarioResponse';
import { PessoaResponse } from '../../model/PessoaResponse';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav',
  imports: [
    NzLayoutModule,
    CommonModule,
    NzMenuModule,
    RouterModule,
    NzIconModule,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.less',
})
export class NavComponent {
  isCollapsed = false;
  ACESSO = ACESSO;
  roles: string[] = [];
  usuario: UsuarioResponse = new UsuarioResponse();
  pessoa: PessoaResponse = new PessoaResponse();

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly usuarioService: UsuarioService,
    private readonly stateService: StateService,
    private readonly message: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.carregarUsuario();
    this.stateService.stateChanged$.subscribe(() => {
      this.carregarUsuario();
    });
  }

  private carregarUsuario(): void {
    this.usuarioService.usuarioLogado().subscribe({
      next: (usuario: UsuarioResponse | null) => {
        if (usuario) {
          this.usuario = usuario;
          this.pessoa = usuario.pessoa;
          this.roles = usuario.perfis.map((perfil) => perfil.nome);
        }
      },
      error: (error) => {
        this.message.error(error.error.message);
      },
      complete: () => {
        console.log('Usuário carregado:', this.usuario);
      },
    });
  }

  onCollapse(collapsed: boolean): void {
    requestAnimationFrame(() => {
      this.isCollapsed = collapsed;
    });
  }

  onKeyDown(event: KeyboardEvent): void {
    console.log('Tecla pressionada:', event.key);
  }

  deslogar(): void {
    this.authService.logout();
    this.router.navigate(['login']);
    this.message.info('Usuário deslogado com sucesso');
  }
}
