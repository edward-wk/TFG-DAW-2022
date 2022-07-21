import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CalendarEvent} from "calendar-utils";

@Injectable({
    providedIn: 'root'
})
export class AgendaService {

    constructor(private http: HttpClient) {
    }

    private URL = 'http://localhost:4001/agenda'

    getAgendaByPsicologo(psicologo:any): Observable<CalendarEvent[]> {
        return this.http.get<CalendarEvent[]>(this.URL + '/getByPsicologo/'+psicologo)
    }

    addCita(cita: any) {
        return this.http.put(`${this.URL}/`, cita)
    }

    modificarCita(datos: any) {
        return this.http.put(`${this.URL}/modificarCita`, datos)
    }

    eliminarCita(id:any) {
        return this.http.delete(`${this.URL}/eliminarCita/${id}`)
    }

}
