import { TipoVinculo } from './TipoVinculo';

export class VinculoResponse {
  id: number;
  tipo: TipoVinculo;
  dataInicio: string;
  ativo: boolean;

  constructor() {
    this.id = 0;
    this.tipo = TipoVinculo.CLT;
    this.dataInicio = new Date().toISOString().split('T')[0];
    this.ativo = true;
  }
}
