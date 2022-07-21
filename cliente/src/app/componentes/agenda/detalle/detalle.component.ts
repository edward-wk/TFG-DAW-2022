import {Component, Input, OnInit} from '@angular/core';
import {DataShareService} from "../../../servicios/data-share.service";
import {AgendaService} from "../../../servicios/agenda.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-detalle',
    templateUrl: './detalle.component.html',
    styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
    @Input() public evento: any;

    constructor(private dataShare: DataShareService,
                private servicioAgenda: AgendaService,
                private modalRef: NgbModal) {
    }

    ngOnInit(): void {
    }

    eliminarCita() {
        let susRemove = this.servicioAgenda.eliminarCita(this.evento.id).subscribe({
            complete: () => {
                susRemove.unsubscribe()
                this.modalRef.dismissAll()
            }
        })
        this.dataShare.refreshCalendar$.next(`Eliminar:${this.evento.id}`)
    }
}
