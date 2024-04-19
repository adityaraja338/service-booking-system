import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddEditComponent } from './bookings/add-edit/add-edit.component';
import { AuthGuard } from './auth/auth.guard';
import { ViewComponent } from './bookings/view/view.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/login',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'bookings',
    pathMatch: 'full',
    redirectTo: 'bookings/create',
  },
  {
    path: 'bookings',
    children: [
      {
        path: 'create',
        component: AddEditComponent,
      },
      {
        path: 'edit',
        component: AddEditComponent,
      },
      {
        path: 'view-bookings',
        component: ViewComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
