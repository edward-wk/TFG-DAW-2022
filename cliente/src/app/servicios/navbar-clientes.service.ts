import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

export interface Dat {
    _id: string,
    nomApe1Ape2: string
}

@Injectable({
    providedIn: 'root'
})

export class NavbarClientesService {

    constructor(private http: HttpClient) {
    }

    getDatos(nombre: string) {
        return this.http.get<Dat[]>('http://localhost:4001/paciente/nombreNav/' + nombre);
    }
}
