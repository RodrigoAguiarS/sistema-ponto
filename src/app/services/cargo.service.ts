import { Injectable } from '@angular/core';
import { CargoResponse } from '../model/CargoResponse';
import { API_CONFIG } from '../config/api.config';
import { HttpClient } from '@angular/common/http';
import { map, mergeMap, Observable, of, toArray } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CargoService {
constructor(private readonly http: HttpClient) {}

  carregaPaginado(page: number, size: number): Observable<CargoResponse[]> {
    return this.http
      .get<{ content: CargoResponse[] }>(
        `${API_CONFIG.baseUrl}/cargos?page=${page}&size=${size}`
      )
      .pipe(map((response) => response.content));
  }

  findAllPaginada(
    page: number,
    size: number
  ): Observable<{ content: CargoResponse[]; totalElements: number }> {
    return this.http.get<{ content: CargoResponse[]; totalElements: number }>(
      `${API_CONFIG.baseUrl}/cargos?page=${page}&size=${size}&sort=nome`
    );
  }

  findAll(): Observable<CargoResponse[]> {
    const pageSize = 50;
    let currentPage = 0;
    let allPerfis: CargoResponse[] = [];

    return this.carregaPaginado(currentPage, pageSize).pipe(
      mergeMap((cargos) => {
        allPerfis = allPerfis.concat(cargos);
        if (cargos.length < pageSize) {
          return of(allPerfis);
        } else {
          currentPage++;
          return this.carregaPaginado(currentPage, pageSize).pipe(
            mergeMap((nextTipos) => {
              allPerfis = allPerfis.concat(nextTipos);
              return of(allPerfis);
            })
          );
        }
      }),
      toArray(),
      map((arrays: any[]) => arrays.flat())
    );
  }

  findById(id: any): Observable<CargoResponse> {
    return this.http.get<CargoResponse>(
      `${API_CONFIG.baseUrl}/cargos/${id}`
    );
  }

  create(CargoResponse: CargoResponse): Observable<CargoResponse> {
    return this.http.post<CargoResponse>(
      `${API_CONFIG.baseUrl}/cargos`,
      CargoResponse
    );
  }

  update(CargoResponse: CargoResponse): Observable<CargoResponse> {
    return this.http.put<CargoResponse>(
      `${API_CONFIG.baseUrl}/cargos/${CargoResponse.id}`,
      CargoResponse
    );
  }

  delete(id: any): Observable<CargoResponse> {
    return this.http.delete<CargoResponse>(
      `${API_CONFIG.baseUrl}/cargos/${id}`
    );
  }

  buscarPaginado(params: {
    page: number;
    size: number;
    id?: string;
    nome?: string;
    descricao?: string;
  }): Observable<{ content: CargoResponse[]; page: { totalElements: number } }> {
    let url = `${API_CONFIG.baseUrl}/cargos?page=${params.page}&size=${params.size}`;

    if (params.id) {
      url += `&id=${params.id}`;
    }

    if (params.nome) {
      url += `&nome=${encodeURIComponent(params.nome)}`;
    }

    if (params.descricao) {
      url += `&descricao=${encodeURIComponent(params.descricao)}`;
    }

    return this.http.get<{
      content: CargoResponse[];
      page: { totalElements: number };
    }>(url);
  }
}

