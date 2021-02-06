import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatFormComponent } from './stat-form/stat-form.component';

const routes: Routes = [
  { path: "stat-form", component: StatFormComponent },
  { path: "", redirectTo: '/stat-form', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
