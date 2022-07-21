import {NgModule} from '@angular/core';
import {AppComponent} from "./app.component";
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import {CabeceraComponent} from "./componentes/cabeceras/cabecera.component";
import {MenuConsultaComponent} from "./componentes/cuerpo/menu/menu-consulta.component";
import {AntecedentesComponent} from "./componentes/cuerpo/contenido/antecedentes/antecedentes.component";
import {PruebasComponent} from "./componentes/cuerpo/contenido/pruebas/pruebas.component";
import {
    AltaPacienteComponent
} from "./componentes/cuerpo/contenido/administrativo/alta-paciente/alta-paciente.component";
import {
    AltaPsicologoComponent
} from './componentes/cuerpo/contenido/administrativo/alta-psicologo/alta-psicologo.component';
import {ConsultaComponent} from "./componentes/cuerpo/contenido/consulta/consulta.component";
import {SeguimientoComponent} from "./componentes/cuerpo/contenido/seguimiento/seguimiento.component";
import {AdminGuard} from "./guards/admin.guard";
import {TokenInterceptorService} from "./servicios/token-interceptor.service";
import {SigninComponent} from "./componentes/login/signin.component";
import {MisDatosComponent} from './componentes/cuerpo/contenido/mis-datos/mis-datos.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CambiarPassComponent} from './componentes/cuerpo/contenido/administrativo/cambiar-pass/cambiar-pass.component';
import {ToastrModule} from "ngx-toastr";
import {AgendaComponent} from './componentes/agenda/agenda.component';
import {CabeceraPacienteComponent} from "./componentes/cuerpo/contenido/cabecera/cabecera-paciente.component";
import {DatePipe} from '@angular/common';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {FlatpickrModule} from "angularx-flatpickr";
import {NgbModalModule} from "@ng-bootstrap/ng-bootstrap";
import {DetalleComponent} from './componentes/agenda/detalle/detalle.component';
import {
    InformeCompletoComponent
} from "./componentes/cuerpo/contenido/informes_tipo/informe-completo/informe-completo.component";
import {ModPacienteComponent} from './componentes/cuerpo/contenido/mod-paciente/mod-paciente.component';
import {PsicologoGuard} from "./guards/psicologo.guard";
import {AltaCitaComponent} from './componentes/agenda/alta-cita/alta-cita.component';

@NgModule({
    declarations: [
        AppComponent,
        CabeceraComponent,
        MenuConsultaComponent,
        CabeceraPacienteComponent,
        AntecedentesComponent,
        ConsultaComponent,
        PruebasComponent,
        AltaPacienteComponent,
        AltaPsicologoComponent,
        SeguimientoComponent,
        SigninComponent,
        MisDatosComponent,
        CambiarPassComponent,
        AgendaComponent,
        DetalleComponent,
        InformeCompletoComponent,
        ModPacienteComponent,
        AltaCitaComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        AutocompleteLibModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(), // ToastrModule added
        NgbModalModule,
        FlatpickrModule.forRoot(),
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
        BrowserAnimationsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
    ],
    providers: [
        AdminGuard,
        PsicologoGuard,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptorService,
            multi: true
        },
        DatePipe
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
