import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {BbddService} from 'src/app/servicios/bbdd.service';
import {DataShareService} from 'src/app/servicios/data-share.service';
import {DatePipe} from "@angular/common";
import {ToastrService} from 'ngx-toastr';
import * as moment from 'moment';


@Component({
    selector: 'app-seguimiento',
    templateUrl: './seguimiento.component.html',
    styleUrls: ['./seguimiento.component.css']
})
export class SeguimientoComponent implements OnInit {
    constructor(private fb: FormBuilder,
                private bbdd: BbddService,
                private toastr: ToastrService,
                private dataShare: DataShareService,
                private pipedate: DatePipe) {
    }

    dehabilitarBtn:Boolean=false;

    ngOnInit(): void {
        this.cargarPantalla();
    }

    tablaSeguimientos: String[] = []
    datosPaciente: any
    fechaCita: any

    seguimientoForm = this.fb.group({
        observaciones: [''],
        anotaciones: [''],
        conducta_a_seguir: [''],
        fecha_cita: [''],
    })


    cargarPantalla() {
        localStorage.removeItem('seguimientoId')
        let suscripcion = this.dataShare.paciente$.subscribe(
            {
                next: value => {
                    if (value) {
                        const ruta = value.datosMedicos?.valoracion[parseInt(localStorage.getItem('valoracionId')!)]
                        this.seguimientoForm.controls['observaciones'].setValue(ruta?.seguimiento.observaciones)
                        this.seguimientoForm.controls['anotaciones'].setValue(ruta?.seguimiento.anotaciones)
                        this.seguimientoForm.controls['conducta_a_seguir'].setValue(ruta?.seguimiento.conducta_a_seguir)
                        this.fechaCita = this.pipedate.transform(ruta?.seguimiento.fecha_cita, 'dd-MM-yyyy');
                        this.dehabilitarBtn = localStorage.getItem('valorCheckAlta') === 'true'

                        this.datosPaciente = ruta
                        let fechaFormateada: string | null;
                        this.tablaSeguimientos = []

                        const ind = ruta?.seguimiento.length

                        if (ind > 0) {
                            for (const rutaElement of ruta.seguimiento) {
                                if (rutaElement.fecha_cita !== undefined) {
                                    fechaFormateada = this.pipedate.transform(rutaElement.fecha_cita, 'dd-MM-yyyy');
                                }
                                this.tablaSeguimientos.push(fechaFormateada!)
                            }

                            this.cargarDatos(ruta.seguimiento[ruta.seguimiento.length - 1])
                            localStorage.setItem('seguimientoId', String(ruta.seguimiento.length - 1))
                        }
                    }else{
                        localStorage.setItem('seguimientoId', String(-1))
                    }
                },
                error: err => {
                    localStorage.setItem('seguimientoId', String(-1))
                },
                complete: () => {
                    suscripcion.unsubscribe()
                }
            }
        )
    }

    guardar() {
        this.seguimientoForm.value.fecha_cita = moment(new Date()).format('YYYY-MM-DD[T00:00:00.000Z]');
        let sus = this.bbdd.altaSeguimiento(this.seguimientoForm.value, localStorage.getItem('valoracionId')).subscribe({
            next: () => {
                this.toastr.success('', 'Se ha guardado correctamente')
            },
            error: err => {
                switch (err.status) {
                    case 0:
                        this.toastr.error('', "ERROR EN EL SERVIDOR")
                        break;
                    case 420:
                        this.toastr.warning('', err.error.message)
                        break;
                    case 421:
                        this.toastr.warning('', err.error.message)
                        break;
                    default:
                        this.toastr.error(`[SERVIDOR] ${err.error.message}`, `[SERVIDOR] ${err.error.status}`)
                }
            },
            complete: () => {
                sus.unsubscribe()
            }
        })
        setTimeout(() => {
            this.dataShare._idPaciente$.next(String(localStorage.getItem('idPaciente')))
        }, 1500)
    }

    modificar() {
        let sus = this.bbdd.modificarSeguimiento(this.seguimientoForm.value, localStorage.getItem('valoracionId'), localStorage.getItem('seguimientoId')).subscribe({
            next: () => {
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
        })
    }

    cambiarValoracion(evento: any) {
        for (const [ind, seguimiento] of this.datosPaciente.seguimiento.entries()) {
            if (evento.value === this.pipedate.transform(seguimiento.fecha_cita, 'dd-MM-yyyy')) {
                localStorage.setItem('seguimientoId', ind)
                this.cargarDatos(seguimiento)
                break;
            }
        }
    }

    cargarDatos(seguimiento: any) {
        if (seguimiento) {
            this.seguimientoForm.controls['observaciones'].setValue(seguimiento?.observaciones)
            this.seguimientoForm.controls['anotaciones'].setValue(seguimiento?.anotaciones)
            this.seguimientoForm.controls['conducta_a_seguir'].setValue(seguimiento?.conducta_a_seguir)
            this.seguimientoForm.controls['fecha_cita'].setValue(seguimiento?.fecha_cita)
        }
    }
}
