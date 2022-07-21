import {Component, OnInit} from '@angular/core';
import {BbddService} from "../../../../servicios/bbdd.service";
import {Paciente} from "../../../../modelo/paciente";
import {DataShareService} from "../../../../servicios/data-share.service";
import {DatePipe} from '@angular/common'
import {ToastrService} from "ngx-toastr";

export interface Valoracion {
    ordenI: number,
    diagnosticoI: String,
    fechaInicioI: String,
}

@Component({
    selector: 'app-cabecera-paciente',
    templateUrl: './cabecera-paciente.component.html',
    styleUrls: ['./cabecera-paciente.component.css']
})
export class CabeceraPacienteComponent implements OnInit {

    constructor(private servicio: BbddService,
                private dataShare: DataShareService,
                private datepipe: DatePipe,
                private toastr: ToastrService) {
    }

    valorCheckAlta: boolean = false
    fechaAlta: any;

    ngOnInit(): void {
        this.tablaDiagnosticos = []
        let sus = this.dataShare._idPaciente$.subscribe(
            {
                next: value => {
                    if (value !== '') {
                        this.obtenerDiagnosticos(value)
                    } else if (localStorage.getItem('idPaciente')) {
                        this.obtenerDiagnosticos(localStorage.getItem('idPaciente'))
                    }
                },
                complete: () => {
                    sus.unsubscribe()
                }
            }
        );
    }

    tablaDiagnosticos: Valoracion[] = []
    data!: Paciente
    edad = 0

    calcularEdad(fxNacimiento: any): number {
        let timeDiff = Math.abs(Date.now() - new Date(fxNacimiento).getTime());
        return Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    }

    obtenerDiagnosticos(id: any) {
        let sus = this.servicio.getPaciente(id).subscribe(
            {
                next: value => {
                    this.tablaDiagnosticos = []
                    this.edad = 0

                    // Datos para la cabecera del paciente
                    this.data = value
                    this.edad = this.calcularEdad(this.data.fecha_nacimiento) || 0

                    // Recuperar las valoraciones del paciente
                    for (const [index, data] of value.datosMedicos.valoracion.entries()) {
                        let fechaFormateada;
                        if (data?.fecha_inicio !== undefined) {
                            fechaFormateada = this.datepipe.transform(data.fecha_inicio, 'dd/MM/yyyy');
                        }
                        if (data?.fecha_alta !== undefined) {
                            this.fechaAlta = this.datepipe.transform(data.fecha_alta, 'dd/MM/yyyy');

                            this.valorCheckAlta = true;
                        } else {
                            this.valorCheckAlta = false;
                        }
                        let registro: Valoracion = {
                            ordenI: index,
                            diagnosticoI: data?.diagnostico_psicologico?.diagnostico || 'En valoración',
                            fechaInicioI: fechaFormateada || ''
                        }

                        this.tablaDiagnosticos.push(registro)
                    }
                    localStorage.setItem('valorCheckAlta', String(this.valorCheckAlta))
                    localStorage.setItem('valoracionId', String(this.data.datosMedicos.valoracion.length - 1))
                    this.dataShare.paciente$.next(this.data)
                    // Recuperar las valoraciones del paciente
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

    cambiarValoracion(evento: any) {
        const indice = (evento.length - 1) - evento.selectedIndex
        localStorage.setItem('valoracionId', String(indice))
        if (this.data?.datosMedicos.valoracion[indice].fecha_alta != undefined) {
            this.valorCheckAlta = true;
            this.fechaAlta = this.datepipe.transform(this.data?.datosMedicos.valoracion[indice].fecha_alta, 'dd/MM/yyyy');
        } else {
            this.valorCheckAlta = false;
        }
        localStorage.setItem('valorCheckAlta', String(this.valorCheckAlta))
        this.dataShare.paciente$.next(this.data)

    }

    cerrarValidacion(evento: any) {
        if (evento.checked) {
            if (confirm('La valoración se cerrara y no podra volver a modificarse. ¿quiere continuar?')) {
                this.valorCheckAlta = true;
                this.modificar();
                this.data.datosMedicos.valoracion[parseInt(localStorage.getItem('valoracionId')!)].fecha_alta = new Date()
                localStorage.setItem('valorCheckAlta', String(this.valorCheckAlta))
                this.fechaAlta = this.datepipe.transform(new Date(), 'dd/MM/yyyy');
                this.dataShare.paciente$.next(this.data)
            } else {
                this.valorCheckAlta = false;
                evento.checked = false;
                return
            }
        } else {
            this.valorCheckAlta = true;
            evento.checked = true;
        }
    }

    modificar() {
        let sus = this.servicio.modificarFechaAltaPaciente().subscribe({
            next: value => {
                this.toastr.success('', 'Modificación realizada correctamente')
            },
            error: err => {
                this.toastr.error('Modificación no realizada', '[ERROR SERVIDOR]: ' + err.status)
            },
            complete: () => {
                sus.unsubscribe()
            }
        })
    }
}
