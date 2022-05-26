import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor{
  constructor(private jwt:JwtHelperService){}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    if (!token || this.jwt.isTokenExpired(token!)) {
         
          return next.handle(req);
    }
   
    const headers = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
    return next.handle(headers);
  }
}