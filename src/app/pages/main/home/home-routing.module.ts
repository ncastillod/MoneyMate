import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  },  {
    path: 'gastos',
    loadChildren: () => import('./gastos/gastos.module').then( m => m.GastosPageModule)
  },
  {
    path: 'resumen',
    loadChildren: () => import('./resumen/resumen.module').then( m => m.ResumenPageModule)
  },
  {
    path: 'ingresos',
    loadChildren: () => import('./ingresos/ingresos.module').then( m => m.IngresosPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
