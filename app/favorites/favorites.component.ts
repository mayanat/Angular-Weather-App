import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Favorite } from '../models/favorite.model';
import { AppState } from './../app.state';
import * as FavoriteActions from '../actions/favorite.actions';
import { ApixuService } from '../apixu.service';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';


@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
  animations: [

    trigger('listAnimation', [
      transition('* => *', [

        query(':enter', style({ opacity: 0 }), { optional: true }),

        query(':enter', stagger('300ms', [
          animate('1s ease-in', keyframes([
            style({ opacity: 0, transform: 'translateY(-75%)', offset: 0 }),
            style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 }),
          ]))]), { optional: true })
      ])
    ])
  ]
})
export class FavoritesComponent implements OnInit {
  private readonly notifier: NotifierService;
  favorites: Observable<Favorite[]>;
  favLength:number;

  constructor(private store: Store<AppState>, public apixuService: ApixuService, public router: Router, notifierService: NotifierService) {
    this.favorites = store.select('favorite');
    this.notifier = notifierService;
  }
  delFavorite(index) {
    this.store.dispatch(new FavoriteActions.RemoveFavorite(index))
    this.notifier.notify('warning', 'A Favorite Has Been Deleted');
  }
  showInHome(name, idKey) {
    this.apixuService.cityName = name;
    this.apixuService.loctionKey = idKey;
    this.router.navigate(['/']);
  }
  ngOnInit() { 

  }

}
