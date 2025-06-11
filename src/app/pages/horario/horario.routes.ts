import { Routes } from "@angular/router";
import { HorarioCreateComponent } from "./horario-create/horario-create.component";

export const horarioRoutes: Routes = [
  { path: 'consultar/:id', component: HorarioCreateComponent },
];
