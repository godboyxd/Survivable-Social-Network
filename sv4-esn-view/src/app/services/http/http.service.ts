import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams, Response } from '@angular/http';
import { Observable } from "rxjs";

@Injectable()
export class HttpService {

  baseUri = "http://localhost:3000";

  jwt = localStorage.getItem('jwt');

  private http: Http;

  constructor(http: Http) {
    this.http = http;
  }

  get = (path: string, params?: Object): Observable<any> => {
    let requestUri = `${this.baseUri}${path}`;
    let requestOptions = new RequestOptions();
    if (params) {
      let urlSearchParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        urlSearchParams.set(key, params[key]);
      });
      requestOptions.search = urlSearchParams;
    }
    if (this.jwt) {
      let headers: Headers = new Headers({ 'Authorization': `JWT ${this.jwt}` });
      requestOptions.headers = headers;
    }

    return this.http.get(requestUri, requestOptions)
      .map(res => res.json())
      .catch(this.handleError)
  };

  post = (path: string, params?: Object): Observable<any> => {
    let requestUri = encodeURI(`${this.baseUri}${path}`);
    let requestOptions = new RequestOptions();
    if (this.jwt) {
      let headers: Headers = new Headers({ 'Authorization': `JWT ${this.jwt}` });
      requestOptions.headers = headers;
    }

    return this.http.post(requestUri, JSON.stringify(params), requestOptions)
      .map(res => res.json())
      .catch(this.handleError);
  };

  private handleError = (error: Response) => {
    return Observable.throw(error.json());
  }

}
