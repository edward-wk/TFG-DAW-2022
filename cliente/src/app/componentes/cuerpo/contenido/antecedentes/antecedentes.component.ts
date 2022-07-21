import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {DataShareService} from "../../../../servicios/data-share.service";
import {BbddService} from 'src/app/servicios/bbdd.service';
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-antecedentes',
    templateUrl: './antecedentes.component.html',
    styleUrls: ['./antecedentes.component.css']
})
export class AntecedentesComponent implements OnInit {

    constructor(private fb: FormBuilder,
                private bbdd: BbddService,
                private toastr: ToastrService,
                private dataShare: DataShareService) {

    }

    ngOnInit(): void {
        this.cargarPantalla();
    }


    antecedentesForm = this.fb.group({
        ant_familiares: [''],
        ant_personales: ['']

    })

    cargarPantalla() {
        let sus = this.dataShare.paciente$.subscribe({
                next: value => {
                    if (value) {
                        const ruta = value.datosMedicos.antecedentes
                        this.antecedentesForm.controls['ant_familiares'].setValue(ruta?.familiares.observaciones)
                        this.antecedentesForm.controls['ant_personales'].setValue(ruta?.personales.observaciones)
                    }
                },
                complete: () => {
                    sus.unsubscribe()
                }
            }
        )
    }

    guardar() {
        let sus = this.bbdd.modificarAntecedentes(this.antecedentesForm.value).subscribe({
            next: value => {
                this.toastr.success('', 'Se ha guardado correctamente')
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
        })

    }


}
