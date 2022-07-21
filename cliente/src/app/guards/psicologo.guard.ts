import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {filter, map} from "rxjs";
import {AuthService} from "../servicios/auth.service";

@Injectable({
    providedIn: 'root'
})

export class PsicologoGuard implements CanActivate {
    constructor(private authService: AuthService,
                private router: Router) {
    }

    canActivate() {
        return this.authService.getRoles().pipe(
            filter(member => !!member),  // Filter NULL value here before sending object further
            map(member => {
                    const index = member.findIndex(rol => rol === 'psicologo');
                    if (index === -1) {
                        localStorage.clear()
                        this.router.navigate(['/login'])
                    }
                    return index != -1;
                }
            ))
    }
}
