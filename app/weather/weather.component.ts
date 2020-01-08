import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApixuService } from "../apixu.service";
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from './../app.state';
import { Favorite } from '../models/favorite.model'
import * as FavoriteActions from '../actions/favorite.actions';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';





@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],

})
export class WeatherComponent implements OnInit {
  private readonly notifier: NotifierService;
  public weatherSearchForm: FormGroup;
  weatherData: any = {};
  Days5yWeatherData: any = {};
  toggle: boolean = true;
  searchTerm: FormControl = new FormControl();
  myCitys = <any>[];
  favorites: Observable<Favorite[]>;
  favorites2: Favorite[];

  constructor(private formBuilder: FormBuilder, public apixuService: ApixuService, private store: Store<AppState>, notifierService: NotifierService) {
    this.favorites = store.select('favorite');
    this.notifier = notifierService;
  }

  toggleView($event: any) {
    this.toggle = this.toggle ? false : true;
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.apixuService.getkeyByLatitudeAndLongitude(position.coords.latitude, position.coords.longitude)
          .subscribe((data: any) => {
            this.apixuService.cityName = data.EnglishName
            this.apixuService.loctionKey = data.Key
            this.apixuService
              .getWeather(this.apixuService.loctionKey)
              .subscribe(data => {
                this.weatherData = data;
              })
          })
        this.apixuService
          .get5DaysWeather(this.apixuService.loctionKey)
          .subscribe(data => {
            this.Days5yWeatherData = data;
          })
      })
    } else {
      this.notifier.notify('warning', 'Geolocation is not supported by this browser.');
    }
  }

  sendToAPIXU(LocalizedName) {
    this.apixuService.cityName = LocalizedName;
    this.apixuService.getkey(LocalizedName)
      .subscribe(data => {
        this.apixuService.loctionKey = data[0].Key
        this.apixuService
          .getWeather(this.apixuService.loctionKey)
          .subscribe(data => {
            this.weatherData = data;
          })
      })
    this.apixuService
      .get5DaysWeather(this.apixuService.loctionKey)
      .subscribe(data => {
        this.Days5yWeatherData = data;
      })
  }

  

  addFavorite(name, idKey, currentWeather) {
    this.store.select(state => state).subscribe((data: any) => {
      this.favorites2 = data.favorite;
    })
    this.favorites2.forEach((element: any) => {
      if (element.idKey == idKey) {
    return  this.notifier.notify('warning', 'This Favorite Already Exists');
      }
    })
    this.store.dispatch(new FavoriteActions.AddFavorite({ name: name, currentWeather: currentWeather, idKey: idKey }))
  
}
ngOnInit() {
  this.searchTerm.valueChanges.subscribe(
    term => {
      if (term != '') {
        this.apixuService.search(term).subscribe(
          data => {
            this.myCitys = data as any[];
          })
      }
    })

  this.weatherSearchForm = this.formBuilder.group({
    location: ['', Validators.pattern('^[a-zA-Z \-\']+')]
  });

  this.apixuService
    .get5DaysWeather(this.apixuService.loctionKey)
    .subscribe(data => {
      this.Days5yWeatherData = data;
    })

  this.apixuService
    .getWeather(this.apixuService.loctionKey)
    .subscribe(data => {
      this.weatherData = data;
    })
}


}
