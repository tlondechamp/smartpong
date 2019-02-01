import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ChartsModule } from 'ng2-charts';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ToastrModule } from 'ngx-toastr';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { TOASTER_LIFESPAN } from './constants';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IndexComponent } from './index.component';
import { GameAddComponent } from './game/add/game-add.component';
import { GameComponent } from './game/game.component';
import { GameListComponent } from './game/list/game-list.component';
import { GameService } from './game/game.service';
import { NavigationComponent } from './navigation/navigation.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PlayerComponent } from './player/player.component';
import { PlayerListComponent } from './player/list/player-list.component';
import { PlayerService } from './player/player.service';
import { SeasonComponent } from './season/season.component';
import { SeasonListComponent } from './season/list/season-list.component';
import { SeasonService } from './season/season.service';

import { KeysPipe } from './utils/keys-pipe';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    GameComponent,
    GameAddComponent,
    GameListComponent,
    KeysPipe,
    NavigationComponent,
    PageNotFoundComponent,
    PlayerComponent,
    PlayerListComponent,
    SeasonComponent,
    SeasonListComponent,
  ],
  entryComponents: [
    GameAddComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    HttpClientModule,
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    TabsModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: TOASTER_LIFESPAN
    }),
    TypeaheadModule.forRoot(),
  ],
  providers: [
    SeasonService,
    GameService,
    PlayerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
