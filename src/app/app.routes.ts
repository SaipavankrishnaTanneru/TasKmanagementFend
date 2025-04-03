import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { EditTaskComponent } from './components/edit-task/edit-task.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  {
    path:'',
    redirectTo:'',
    pathMatch:'full'
  },
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'user-dashboard', component: UserDashboardComponent },
  { path: 'login', component: LoginComponent},
  { path: '**', redirectTo: '' },
  {
    path:'edit',
    component:EditTaskComponent
  }
];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }