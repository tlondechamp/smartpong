import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SeasonComponent } from './season/season.component';

const routes: Routes = [
	{ path: '', component: SeasonComponent, pathMatch: 'full' },
	{ path: '404', component: PageNotFoundComponent },
  	{ path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
