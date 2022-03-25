import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from '../message.service';
import { ApiResponse } from './ApiResponse';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) {}
  private heroesUrl = 'https://reqres.in/api/users?page=2';
  getHeroes(): Observable<Hero[]> {
    return this.http.get<ApiResponse[]>(this.heroesUrl).pipe(
      map((response: any) => response.data),
      catchError(this.handleError<Hero[]>('getHeroes', [])),
      tap((_) => this.log('fetched heroes'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getHero(id: number): Observable<Hero> {
    const url = 'https://reqres.in/api/users/' + id;
    return this.http.get<ApiResponse>(url).pipe(
      map((response: any) => response.data),
      catchError(this.handleError<Hero>('getHero id=' + id)),
      tap((_) => this.log('fetched heroe id=' + id))
    );
  }

  private log(message: String) {
    this.messageService.add('HeroService :' + message);
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  updateHero(hero: Hero): Observable<any> {
    const url = 'https://reqres.in/api/users/' + hero.id;
    return this.http.put(url, hero, this.httpOptions).pipe(
      tap((_) => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  //   searchHeroes(term :String):Observable<Hero[]>{
  // if(!term.trim()){
  //   return of([]);
  // }
  // const url = 'https://reqres.in/api/users/' + term;
  // return this.http.get<ApiResponse>(url).pipe(
  //   tap(x=>x.length?
  //     this.log('Found Heroes matching '+term):
  //     this.log('no heroes matching '+term),
  //     catchError(this.handleError<any>('searchHeroes'))

  //     )
  // )
  //   }
}
