import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SeasonComponent } from './season/season.component';
import { SeasonListComponent } from './season/list/season-list.component';
import { SeasonService } from './season/season.service';
import { NavigationComponent } from './navigation/navigation.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { GameComponent } from './game/game.component';
import { GameListComponent } from './game/list/game-list.component';
import { GameService } from './game/game.service';
import { PlayerComponent } from './player/player.component';
import { PlayerListComponent } from './player/list/player-list.component';
import { PlayerService } from './player/player.service';

@NgModule({
  declarations: [
    AppComponent,
    SeasonComponent,
    SeasonListComponent,
    NavigationComponent,
    PageNotFoundComponent,
    GameComponent,
    GameListComponent,
    PlayerComponent,
    PlayerListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    SeasonService,
    GameService,
    PlayerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
