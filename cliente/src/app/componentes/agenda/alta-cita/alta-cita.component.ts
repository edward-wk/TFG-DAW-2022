import {Component, Input, OnInit} from '@angular/core';
import {AgendaService} from "../../../servicios/agenda.service";
import * as moment from "moment";
import {DataShareService} from "../../../servicios/data-share.service";
import {ToastrService} from "ngx-toastr";
import {DatePipe} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-alta-cita',
    templateUrl: './alta-cita.component.html',
    styleUrls: ['./alta-cita.component.css']
})
export class AltaCitaComponent implements OnInit {

    @Input() public parametroInput: any;

    constructor(private agendaService: AgendaService,
                private dataShare: DataShareService,
                private toastr: ToastrService,
                private datepipe: DatePipe,
                private modal: NgbModal) {
    }

    ngOnInit(): void {
        if (this.parametroInput?._id) {
            this.datos.start = this.datepipe.transform(new Date(this.parametroInput.start), 'YYYY-MM-dd HH:mm')!
            this.datos.end = this.datepipe.transform(new Date(this.parametroInput.end), 'YYYY-MM-dd HH:mm')!
            this.datos.title = this.parametroInput.title
            this.datos.color.primary = this.parametroInput.color.primary
        } else {
            this.datos.start = moment().format('YYYY-MM-DD HH:mm')
            this.datos.end = moment().add(1, 'hour').format('YYYY-MM-DD HH:mm')
        }
    }

    datos = {
        id: '',
        idPsicologo: '',
        title: '',
        start: '',
        end: '',
        color: {
            primary: String
        }
    }

    altaCita() {
        if (this.parametroInput?._id) {
            this.datos.id = this.parametroInput._id
            let sus = this.agendaService.modificarCita(this.datos).subscribe({
                next: value => {
                    this.dataShare.refreshCalendar$.next(value)
                    this.toastr.success('Cita modificada.')
                },
                error: err => {
                },
                complete: () => {
                    sus.unsubscribe()
                    this.modal.dismissAll()
                }
            })
        } else {
            this.datos.idPsicologo = localStorage.getItem('username')!

            let sus = this.agendaService.addCita(this.datos).subscribe({
                next: value => {
                    this.dataShare.refreshCalendar$.next(value)
                    this.toastr.success('Cita creada.')
                },
                error: err => {
                },
                complete: () => {
                    sus.unsubscribe()
                    this.modal.dismissAll()
                }
            })
        }
    }
}
