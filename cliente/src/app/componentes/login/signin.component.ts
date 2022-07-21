import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../servicios/auth.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
    user = {
        username: '',
        password: ''
    }

    constructor(private servicio: AuthService,
                private toastr: ToastrService,
                private router: Router) {
    }

    ngOnInit(): void {
    }

    signIn() {
        if (this.user.username !== '' && this.user.password !== '') {
            let sus = this.servicio.singin(this.user).subscribe({
                next: value => {
                    this.toastr.success('', "Login bien")
                    localStorage.setItem('token', value.token);
                    localStorage.setItem('username', value.username);
                    this.router.navigate(['/auth/agenda']).then();
                },
                error: err => {
                    if (err.status === 0) {
                        this.toastr.error('', "ERROR EN EL SERVIDOR")
                        return;
                    }

                    if (err.error.message === 'Error login') {
                        this.toastr.error('', "Los datos son incorrectos.")
                        return;
                    }
                },
                complete: () => {
                    sus.unsubscribe()
                }
            })
        } else {
            this.toastr.warning('Rellena todos los campos')
        }
    }
}
