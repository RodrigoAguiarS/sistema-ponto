import { Routes } from "@angular/router";
import { CargoCreateComponent } from "./cargo-create/cargo-create.component";
import { CargoListComponent } from "./cargo-list/cargo-list.component";
import { CargoUpdateComponent } from "./cargo-update/cargo-update.component";
import { CargoDeleteComponent } from "./cargo-delete/cargo-delete.component";



export const cargoRoutes: Routes = [
  { path: 'create', component: CargoCreateComponent },
  { path: 'list', component: CargoListComponent },
  { path: 'update/:id', component: CargoUpdateComponent },
  { path: 'delete/:id', component: CargoDeleteComponent },
];
