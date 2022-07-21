import {Component, OnInit} from '@angular/core';
import {BbddService} from 'src/app/servicios/bbdd.service';
import {Paciente} from 'src/app/modelo/paciente';
import {DataShareService} from 'src/app/servicios/data-share.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as moment from 'moment';
import {Psicologo} from 'src/app/modelo/psicologo';
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-informe-completo',
    templateUrl: './informe-completo.component.html',
    styleUrls: ['./informe-completo.component.css'],
})
export class InformeCompletoComponent implements OnInit {
    suscripcion: any;
    edad = 0;
    _datos: Paciente | undefined;
    _psicologo: Psicologo | undefined;
    _valoracion: any;
    hoy!: String;
    motivoForm: String = '';
    conclusiones: String = '';
    m_doc = [
        {nombre: 'Revisión medica'},
        {nombre: 'Solicitud del juzgado'},
        {nombre: 'Alta'},
        {nombre: 'Seguimiento'},
        {nombre: 'Petición del paciente'},
    ];

    constructor(private servicio: BbddService,
                private dataShare: DataShareService,
                private toastr: ToastrService) {
        (window as any).pdfMake.vfs = pdfFonts.pdfMake.vfs;
    }

    ngOnInit(): void {

    }

    obtenerDatosPaciente(id: any) {
        let sus = this.servicio.getPaciente(id).subscribe({
            next: (value) => {
                this._datos = value;
                this.edad = this.calcularEdad(this._datos?.fecha_nacimiento);
                this.edad = this.edad || 0;
                this.obtenerValoracion();
            },

            error: (err) => {
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

    obtenerValoracion() {
        this._valoracion = this._datos!.datosMedicos.valoracion[parseInt(localStorage.getItem('valoracionId')!)];
        let usupsico = this._valoracion.psicologo
        this.obtenerDatosPsicologo(usupsico);

    }

    obtenerDatosPsicologo(username: string) {
        this.servicio.getPsicologoByUser(username).subscribe({
            next: dato => {
                this._psicologo = dato;
                this.pdfOpen();
            }
        })
    }

    calcularEdad(fxNacimiento: any): number {
        let timeDiff = Math.abs(Date.now() - new Date(fxNacimiento).getTime());
        return Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    }

    createPDF() {
        let sus = this.suscripcion = this.dataShare._idPaciente$.subscribe(
            {
                next: value => {
                    if (value !== '') {
                        this.obtenerDatosPaciente(value);
                        this.hoy = moment(new Date()).format('DD/MM/yyy');
                    } else if (localStorage.getItem('idPaciente')) {
                        this.obtenerDatosPaciente(localStorage.getItem('idPaciente'));
                        this.hoy = moment(new Date()).format('DD/MM/yyy');
                    }
                },
                complete: () => {
                    sus.unsubscribe()
                }
            });
    }

    pdfOpen() {
        const pdfDefinition: any = {
            content: [
                {
                    alignment: 'justify',
                    columns: [
                        {},
                        {
                            text: 'Datos del centro Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit beatae delectus vitae, dignissimos architecto et, esse voluptates corporis quam rerum numquam eius iusto! Aliquid sit magnam repellendus recusandae dolorum quaerat?\n\n',
                        },
                    ],
                },

                {
                    text: [
                        {text: 'Motivo del informe: ', bold: true},
                        {text: this.motivoForm},
                        '\n\n',
                    ],
                },
                {
                    text: [
                        'El paciente ',
                        this._datos?.nombre,
                        ' ',
                        this._datos?.apellido1,
                        ' ',
                        this._datos?.apellido2,
                        ' con ',
                        this._datos?.tipo_doc,
                        ' ',
                        this._datos?.documento,
                        ' de edad ',
                        this.edad,
                        ' y fecha de nacimiento ',
                        moment(this._datos?.fecha_nacimiento).format('DD/MM/yyyy'),
                        ' acude al centro el día ',
                        moment(this._valoracion?.fecha_inicio).format('DD/MM/yyyy'),
                        ' con motivo de ',
                        this._valoracion?.motivo_consulta,
                        '\n\n',
                    ],
                },
                {
                    text: [
                        'Es atendido por ',
                        this._psicologo?.nombre, ' ', this._psicologo?.apellido1, ' ', this._psicologo?.apellido2,
                        ' con número de colegiado ', this._psicologo?.num_colegiado,
                        ' ',
                        '\n\n',
                    ],
                },
                {
                    text: [
                        'Tras los estudios realizados, el diagnostico psicológico obtenido es que el paciente sufre de ',
                        this._valoracion?.diagnostico_psicologico?.diagnostico,
                        '\n\n',
                    ],
                },
                {
                    text: [
                        {text: 'Sintomas que presenta:', bold: true},
                        {text: this._valoracion?.sintomas},
                        '\n\n',
                    ],
                },
                {
                    text: [
                        {text: 'Antecedentes personales:', bold: true},
                        {text: this._valoracion?.antecendentes?.personales},
                        '\n\n',
                    ],
                },
                {
                    text: [
                        {text: 'Antecedentes familiares:', bold: true},
                        {text: this._valoracion?.antecendentes?.familiares},
                        '\n\n',
                    ],
                },
                {
                    text: [
                        {text: 'Diagnostico Medico:', bold: true},
                        {
                            text: this._valoracion?.diagnostico_medico
                                ?.patologia_medica,
                        },
                        '\n\n',
                    ],
                },
                {
                    text: [
                        {
                            text: 'Pruebas psicológicas realizadas:',
                            style: 'header',
                        }, '\n\n',
                        {
                            text: 'Test Cognitivo:', bold: true
                        },
                        {
                            text: this._valoracion?.test_diagnosticos?.cognitiva.observaciones,
                        },
                        '\n\n',
                        {
                            text: 'Test Emocional:', bold: true
                        },
                        {
                            text: this._valoracion?.test_diagnosticos?.emocional.observaciones,
                        },
                        '\n\n',
                        {
                            text: 'Pruebas psicodiagnósticas:', bold: true
                        },
                        {
                            text: this._valoracion?.test_diagnosticos?.pruebasPsicodiagnostico.observaciones,
                        },
                        '\n\n',
                    ],
                },
                {
                    text: [
                        {
                            text: 'Conclusiones:', bold: true
                        },
                        {text: this.conclusiones},
                        '\n\n\n\n\n\n',
                    ]
                },
                {
                    text: [
                        {
                            text: 'Fecha del informe:'
                        },
                        {
                            text: this.hoy
                        },
                        '\n\n',
                        {
                            text: 'Firma:__________________'
                        },
                        '\n\n',
                        {
                            text: ' N. Col.:'
                        }, this._psicologo?.num_colegiado
                    ]

                }

            ],
            styles: {
                header: {
                    fontSize: 15,
                    bold: true,
                },
            },
        };

        pdfMake.createPdf(pdfDefinition).open();
    }
}
