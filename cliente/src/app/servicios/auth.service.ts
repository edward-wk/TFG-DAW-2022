import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private URL = 'http://localhost:4001/auth';

    constructor(private http: HttpClient, private router: Router) {}

    signup(user: any) {
        return this.http.post<any>(this.URL + '/signup', user);
    }

    singin(user: any) {
        return this.http.post<any>(this.URL + '/signin', user);
    }

    logout() {
        localStorage.removeItem('token');
        this.router.navigate(['/']).then();
    }

    getToken() {
        return localStorage.getItem('token');
    }

    getRoles(): Observable<[string]> {
        return this.http.get<[string]>(this.URL + '/getRoles');
    }

    changePassword(data: any) {
        return this.http.put(this.URL + '/changePassword', data)
    }
}
