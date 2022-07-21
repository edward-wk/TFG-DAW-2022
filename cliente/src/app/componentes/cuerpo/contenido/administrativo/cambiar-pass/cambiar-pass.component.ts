import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../../../servicios/auth.service";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-cambiar-pass',
    templateUrl: './cambiar-pass.component.html',
    styleUrls: ['./cambiar-pass.component.css']
})
export class CambiarPassComponent implements OnInit {

    constructor(private authService: AuthService,
                private toastr:ToastrService) {
    }

    ngOnInit(): void {
    }

    user = {
        passActual: '',
        passNew: '',
        passNew2: ''
    }

    cambiarPass() {
        if (this.user.passNew === this.user.passNew2) {
           let sus = this.authService.changePassword(this.user).subscribe({
                next: value => {
                    this.toastr.success('',"Contraseña modificada correctamente")
                },
                error: err => {
                    if (err.status === 0) {
                        this.toastr.error('', "ERROR EN EL SERVIDOR")
                        return;
                    }

                    this.toastr.error(`${err.error.message}`)
                },
                complete: () => {
                    sus.unsubscribe()
                }
            })
        }else{
            this.toastr.error('', "Las contraseñas no coinciden")
        }
    }

}
