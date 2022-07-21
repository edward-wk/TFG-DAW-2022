import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {BbddService} from 'src/app/servicios/bbdd.service';
import {DataShareService} from '../../../../servicios/data-share.service';
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-pruebas',
    templateUrl: './pruebas.component.html',
    styleUrls: ['./pruebas.component.css'],
})
export class PruebasComponent implements OnInit {
    constructor(
        private fb: FormBuilder,
        private bbdd: BbddService,
        private toastr: ToastrService,
        private dataShare: DataShareService
    ) {
    }

    pruebasForm = this.fb.group({
        dco_psicologico: [''],
        cognitiva: [''],
        emocional: [''],
        pruebasPsicodiagnostico: [''],
    });

    dehabilitarBtn: Boolean = false;

    ngOnInit(): void {
        this.cargarPantalla();
    }

    datosGlobal: any

    cargarPantalla() {
        let sus = this.dataShare.paciente$.subscribe({
            next: (value) => {
                if (value) {
                    this.datosGlobal = value
                    const ruta =
                        value.datosMedicos?.valoracion[
                            parseInt(localStorage.getItem('valoracionId')!)
                            ];
                    this.pruebasForm.controls['dco_psicologico'].setValue(
                        ruta?.diagnostico_psicologico?.diagnostico
                    );
                    this.pruebasForm.controls['cognitiva'].setValue(
                        ruta?.test_diagnosticos?.cognitiva.observaciones
                    );
                    this.pruebasForm.controls['emocional'].setValue(
                        ruta?.test_diagnosticos?.emocional.observaciones
                    );
                    this.pruebasForm.controls[
                        'pruebasPsicodiagnostico'
                        ].setValue(
                        ruta?.test_diagnosticos?.pruebasPsicodiagnostico.observaciones
                    );

                    this.dehabilitarBtn = localStorage.getItem('valorCheckAlta') === 'true'
                }
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
        });
    }

    modificar() {
        let sus = this.bbdd.modificarPruebas(this.pruebasForm.value, localStorage.getItem('valoracionId')).subscribe({
                next: value => {
                    this.toastr.success('', 'Modificación realizada correctamente')
                },
                error: err => {
                    switch (err.status) {
                        case 0:
                            this.toastr.error('', "ERROR EN EL SERVIDOR")
                            break;
                        case 420:
                            this.toastr.warning('', err.error.message)
                            break;
                        default:
                            this.toastr.error(`[SERVIDOR] ${err.error.message}`, `[SERVIDOR] ${err.error.status}`)
                    }
                },
                complete: () => {
                    sus.unsubscribe()
                }
            }
        );
    }
}
