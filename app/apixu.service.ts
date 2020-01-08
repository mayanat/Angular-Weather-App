import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { catchError } from 'rxjs/operators';
import { Observable } from "rxjs";



@Injectable({
  providedIn: 'root'
})
export class ApixuService {

  constructor(private http: HttpClient) { }

  cityName: string = 'Tel Aviv';
  loctionKey: string = '215854';

  apiKey: string = 'InbjxMupX629NWNit6GNygNaZhdbA65k';

  search(term) {
    var listOfCitys = this.http.get("http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=" + this.apiKey + "&q=" + term)
      .pipe(
        debounceTime(500),
        map(
          (data: any) => {
            return (
              data.length != 0 ? data as any[] : [{ "CityName": "No Record Found" } as any]
            );
          }
        ));
    return listOfCitys;
  }

  getkey(location) {
    return this.http.get("http://dataservice.accuweather.com/locations/v1/cities/search?apikey=" + this.apiKey + "&q=" + location)
      .pipe(map(response => response))
      .pipe(catchError(this.errorHandler))

  }

  getkeyByLatitudeAndLongitude(latitude, longitude) {
    return this.http.get("http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=" + this.apiKey + "&q=" + latitude + "%2c" + longitude)
      .pipe(map(response => response))
      .pipe(catchError(this.errorHandler))

  }

  getWeather(key) {
    return this.http.get(
      'http://dataservice.accuweather.com/currentconditions/v1/' + key + '?apikey=' + this.apiKey

    );
  }

  get5DaysWeather(key) {
    return this.http.get(
      'http://dataservice.accuweather.com/forecasts/v1/daily/5day/' + key + '?apikey=' + this.apiKey

    );
  }

  errorHandler(error: HttpErrorResponse) {
    return Observable.throw(error.message || "Server Error");
  }
}
