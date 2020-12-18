import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { IHttpResponse } from "./http.model";

@Injectable()
export class HttpService {
    constructor(private http:HttpClient) {
    }

    post(url: string, data: any) : Observable<IHttpResponse> {
        let subject = new Subject<IHttpResponse>();
        
        this.http.post(url, data).subscribe(res => {
            subject.next({ success: true, data: res });
            subject.complete();
        }, (err: HttpErrorResponse) => {
            console.error(err);
            subject.next({ success: false, message: err.message });
            subject.complete();
        });

        return subject;
    }
}