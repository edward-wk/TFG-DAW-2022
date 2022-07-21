import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
    AltaPacienteComponent
} from './componentes/cuerpo/contenido/administrativo/alta-paciente/alta-paciente.component';
import {MenuConsultaComponent} from "./componentes/cuerpo/menu/menu-consulta.component";
import {AntecedentesComponent} from "./componentes/cuerpo/contenido/antecedentes/antecedentes.component";
import {
    AltaPsicologoComponent
} from './componentes/cuerpo/contenido/administrativo/alta-psicologo/alta-psicologo.component';
import {ConsultaComponent} from "./componentes/cuerpo/contenido/consulta/consulta.component";
import {PruebasComponent} from "./componentes/cuerpo/contenido/pruebas/pruebas.component";
import {SeguimientoComponent} from "./componentes/cuerpo/contenido/seguimiento/seguimiento.component";
import {SigninComponent} from "./componentes/login/signin.component";
import {MisDatosComponent} from './componentes/cuerpo/contenido/mis-datos/mis-datos.component';
import {AdminGuard} from "./guards/admin.guard";
import {AgendaComponent} from './componentes/agenda/agenda.component';
import {
    InformeCompletoComponent
} from "./componentes/cuerpo/contenido/informes_tipo/informe-completo/informe-completo.component";
import {CabeceraComponent} from "./componentes/cabeceras/cabecera.component";
import {ModPacienteComponent} from './componentes/cuerpo/contenido/mod-paciente/mod-paciente.component';
import {PsicologoGuard} from "./guards/psicologo.guard";

const routes: Routes = [
    {
        path: '',
        component: SigninComponent
    },
    {
        path: 'login',
        component: SigninComponent
    },
    {
        path: 'auth',
        component: CabeceraComponent,
        canActivate: [PsicologoGuard],
        children: [
            {
                path: '',
                redirectTo: '/auth/agenda',
                pathMatch: 'full',
            },
            {
                path: "misDatos",
                component: MisDatosComponent
            },
            {
                path: "altaPaciente",
                component: AltaPacienteComponent
            },
            {
                path: "altaPsicologo",
                component: AltaPsicologoComponent,
                canActivate: [AdminGuard],
            },
            {
                path: 'agenda',
                component: AgendaComponent
            },
            {
                path: 'psicologo',
                component: MenuConsultaComponent,
                canActivate: [PsicologoGuard],
                children: [
                    {
                        path: 'antecedentes',
                        component: AntecedentesComponent
                    },
                    {
                        path: 'consulta',
                        component: ConsultaComponent
                    },
                    {
                        path: 'pruebas',
                        component: PruebasComponent
                    },
                    {
                        path: 'seguimiento',
                        component: SeguimientoComponent
                    },
                    {
                        path: 'informes',
                        component: InformeCompletoComponent
                    },
                    {
                        path: 'modificar',
                        component: ModPacienteComponent
                    }
                ]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
