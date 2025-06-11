import { Routes } from '@angular/router';
import { NoAuthGuard } from './auth/noauth.guard';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { NavComponent } from './pages/nav/nav.component';
import { LoginComponent } from './pages/login/login.component';
import { RoleGuard } from './auth/role.guard';
import { ACESSO } from './model/Acesso';
import { ResultComponent } from './pages/result/result.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  {
    path: '',
    component: NavComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      {
        path: 'perfis',
        loadChildren: () =>
          import('./pages/perfil/perfil.routes').then((m) => m.perfilRoutes),
        canActivate: [RoleGuard],
        data: { roles: [ACESSO.SUPERADM] },
      },
      {
        path: 'cargos',
        loadChildren: () =>
          import('./pages/cargo/cargo.routes').then((m) => m.cargoRoutes),
        canActivate: [RoleGuard],
        data: { roles: [ACESSO.SUPERADM, ACESSO.ADMINISTRADOR] },
      },
      {
        path: 'registro-ponto',
        loadChildren: () =>
          import('./pages/registro-ponto/registro-ponto.routes').then(
            (m) => m.registroPontoRoutes
          ),
        canActivate: [RoleGuard],
        data: {
          roles: [ACESSO.SUPERADM, ACESSO.ADMINISTRADOR, ACESSO.OPERADOR],
        },
      },
      {
        path: 'horarios',
        loadChildren: () =>
          import('./pages/horario/horario.routes').then((m) => m.horarioRoutes),
        canActivate: [RoleGuard],
        data: {
          roles: [ACESSO.SUPERADM, ACESSO.ADMINISTRADOR, ACESSO.OPERADOR],
        },
      },
      {
        path: 'usuarios',
        loadChildren: () =>
          import('./pages/usuario/usuario.routes').then((m) => m.usuarioRoutes),
        canActivate: [RoleGuard],
        data: { roles: [ACESSO.SUPERADM, ACESSO.ADMINISTRADOR] },
      },
      {
        path: 'result',
        component: ResultComponent,
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
