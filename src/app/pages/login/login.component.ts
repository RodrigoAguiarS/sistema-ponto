import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Credenciais } from '../../model/Credenciais';
import { AuthService } from '../../services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-login',
    imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    RouterModule,
    NzInputModule,
    NzButtonModule,
    NzSpinModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.less'
})
export class LoginComponent {
  form: FormGroup = new FormGroup({});
  credenciais: Credenciais = {} as Credenciais;
  carregando = false;

  constructor(
    private readonly authservice: AuthService,
    private readonly router: Router,
    private readonly message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }

  logar() {
    if (this.form.valid) {
      this.carregando = true;
      localStorage.removeItem('token');
      this.credenciais = this.form.value;
      this.authservice.authenticate(this.credenciais).subscribe({
        next: (resposta) => {
          const token =
            resposta.headers.get('Authorization')?.substring(7) ?? '';
          this.authservice.successfulLogin(token);
          this.message.success('Login efetuado com sucesso!');
          this.router.navigate(['home']);
        },
        error: (error) => {
          console.error('Erro no login:', error);
          const errorMessage = JSON.parse(error.error).message;
          this.message.error(errorMessage);
        },
        complete: () => {
          this.carregando = false;
        },
      });
    }
  }

  validaCampos(): boolean {
    return this.form.valid;
  }
}
