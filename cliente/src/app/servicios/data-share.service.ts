import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DataShareService {
    public _idPaciente$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    public paciente$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    public refreshCalendar$ = new Subject<any>();
}
