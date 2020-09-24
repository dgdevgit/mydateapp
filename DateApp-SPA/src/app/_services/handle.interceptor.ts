import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HandleInterceptor implements HttpInterceptor {

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
          catchError(err => {
              if (err.status === 401) {
                  return throwError("Un-authorized");
              }
              if (err instanceof HttpErrorResponse) {
                  const appError = err.headers.get("Application-Error");
                  if (appError) {
                      return throwError(appError);
                  }
                  const serError = err.error;
                  let modalStateErrors = "";
                  if (serError.errors && typeof(serError.errors) === "object") {
                      for (const errVal in serError.errors) {
                          modalStateErrors += errVal[errVal] + "\n";
                      }
                  }
              return throwError(modalStateErrors || serError || "Server Error");
              }
          })
        );
    }

    
}