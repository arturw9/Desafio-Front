import { Routes } from '@angular/router';
import { ListaTitulos } from './components/lista-titulos/lista-titulos';
import { CadastroTitulo } from './components/cadastro-titulo/cadastro-titulo';

export const routes: Routes = [
  { path: '', redirectTo: 'lista-titulos', pathMatch: 'full' },
  { path: 'lista-titulos', component: ListaTitulos },
  { path: 'cadastro-titulo', component: CadastroTitulo },
];
