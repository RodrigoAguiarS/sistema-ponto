import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioResponse } from '../model/UsuarioResponse';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(private readonly http: HttpClient) {}

  usuarioLogado(): Observable<UsuarioResponse> {
    return this.http.get<UsuarioResponse>(
      `${API_CONFIG.baseUrl}/usuarios/logado`
    );
  }

  findAll(
    page: number,
    size: number,
    sort: string
  ): Observable<{ content: UsuarioResponse[]; totalElements: number }> {
    return this.http.get<{ content: UsuarioResponse[]; totalElements: number }>(
      `${API_CONFIG.baseUrl}/usuarios?page=${page}&size=${size}&sort=${sort}`
    );
  }

  buscarPaginado(params: {
    page: number;
    size: number;
    sort?: string;
    nome?: string;
    cpf?: string;
    email?: string;
    perfil?: number;
    cargo?: number;
  }): Observable<{
    content: UsuarioResponse[];
    page: { totalElements: number };
  }> {
    let url = `${API_CONFIG.baseUrl}/usuarios?page=${params.page}&size=${params.size}`;

    if (params.sort) {
      url += `&sort=${params.sort}`;
    }

    if (params.nome) {
      url += `&nome=${encodeURIComponent(params.nome)}`;
    }

    if (params.cargo) {
      url += `&cargo=${encodeURIComponent(params.cargo)}`;
    }

    if (params.cpf) {
      url += `&cpf=${encodeURIComponent(params.cpf)}`;
    }

    if (params.email) {
      url += `&email=${encodeURIComponent(params.email)}`;
    }

    if (params.perfil) {
      url += `&perfil=${params.perfil}`;
    }

    return this.http.get<{
      content: UsuarioResponse[];
      page: { totalElements: number };
    }>(url);
  }

  create(usuario: UsuarioResponse): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(
      `${API_CONFIG.baseUrl}/usuarios`,
      usuario
    );
  }

  findById(id: any): Observable<UsuarioResponse> {
    return this.http.get<UsuarioResponse>(
      `${API_CONFIG.baseUrl}/usuarios/${id}`
    );
  }

  update(usuario: UsuarioResponse): Observable<UsuarioResponse> {
    return this.http.put<UsuarioResponse>(
      `${API_CONFIG.baseUrl}/usuarios/${usuario.id}`,
      usuario
    );
  }

  delete(id: any): Observable<UsuarioResponse> {
    return this.http.delete<UsuarioResponse>(
      `${API_CONFIG.baseUrl}/usuarios/${id}`
    );
  }
}
