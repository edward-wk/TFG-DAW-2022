import {Component, OnInit} from '@angular/core';
import {BbddService} from "../../../../servicios/bbdd.service";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-mis-datos',
    templateUrl: './mis-datos.component.html',
    styleUrls: ['./mis-datos.component.css']
})
export class MisDatosComponent implements OnInit {
    constructor(private servicio: BbddService,
                private toastr:ToastrService) {
    }

    visible: any

    mostrar() {
        this.visible = !this.visible;
    }

    psico: any

    ngOnInit(): void {
        let sus = this.servicio.getDatosPsicologo().subscribe(
            {
                next: value => {
                    this.psico = value
                },
                error: err => {
                    if (err.status === 0) {
                        this.toastr.error('', "ERROR EN EL SERVIDOR")
                        return;
                    }

                    this.toastr.error(`[SERVIDOR] ${err.error.message}`, `[SERVIDOR] ${err.error.status}`)
                },
                complete: () => {
                    sus.unsubscribe()
                }
            }
        )
    }

}
