import { Routes } from "@angular/router";
import { RegistroPontoCreateComponent } from "./registro-ponto-create/registro-ponto-create.component";
import { RegistroPontoManualComponent } from "./registro-ponto-manual/registro-ponto-manual.component";


export const registroPontoRoutes: Routes = [
  { path: 'create', component: RegistroPontoCreateComponent },
  { path: 'manual/:id', component: RegistroPontoManualComponent },
];
