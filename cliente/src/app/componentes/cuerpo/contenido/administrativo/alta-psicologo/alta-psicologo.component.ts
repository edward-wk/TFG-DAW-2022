import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms"
import {BbddService} from "../../../../../servicios/bbdd.service";
import {AuthService} from "../../../../../servicios/auth.service";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute} from '@angular/router';
import {Psicologo} from 'src/app/modelo/psicologo';

export interface listaPsicologos {
    _nombre: String
    _valor: String
}

@Component({
    selector: 'app-alta-psicologo',
    templateUrl: './alta-psicologo.component.html',
    styleUrls: ['./alta-psicologo.component.css']
})
export class AltaPsicologoComponent implements OnInit {
    t_doc = [
        {nombre: "DNI"},
        {nombre: "NIE"}
    ];

    constructor(private fb: FormBuilder,
                private serv: BbddService,
                private service: AuthService,
                private toastr: ToastrService,
                private route: ActivatedRoute) {
    }

    t_psicologo: listaPsicologos[] = [];
    tipo: any;
    _psicologo: Psicologo | undefined;
    formClick: any

    ngOnInit(): void {
        let sus = this.route.queryParams.subscribe({
                next: params => {
                    this.tipo = params["tipo"];
                    this.resertearFormulario();
                    this.psicologoForm.controls['tipo_doc'].setValue('DNI')
                    this.psicologoForm.controls['pais'].setValue('España')
                },
                complete: () => {
                    sus.unsubscribe()
                }
            }
        )
    }

    psicologoForm = this.fb.group({
        nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40), Validators.pattern('[a-zA-ZÀ-ÿ\u00f1\u00d1 ]*')]],//agregar ñ y acentos
        apellido1: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40), Validators.pattern('[a-zA-ZÀ-ÿ\u00f1\u00d1 ]*')]],
        apellido2: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40), Validators.pattern('[a-zA-ZÀ-ÿ\u00f1\u00d1 ]*')]],
        tipo_doc: ['DNI', [Validators.required]],
        documento: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
        titulacion: ['', [Validators.required]],
        especialidad: [''],
        credenciales_adic: [''],
        num_colegiado: ['', [Validators.required, Validators.pattern('[0-9]{9}')]],
        telefono: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{9}$')]],
        email: ['', [Validators.required, Validators.email]],
        calle: ['', [Validators.required]],
        cod_postal: ['', [Validators.required, Validators.pattern('((0[1-9]|5[0-2])|[1-4][0-9])[0-9]{3}')]],
        ciudad: ['', [Validators.required]],
        provincia: ['', [Validators.required]],
        pais: ['España'],
        username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]],
    })

    //funcion de envio
    onSubmit() {
        this.formClick = true
        if (this.tipo == "alta") {
            this.altaPsicologo();
        } else {
            this.modificarPsicologo();
        }

    }

    //funcion de control de errores
    getError(field: string): string {
        if (this.formClick && this.psicologoForm.controls[field].hasError('required')) {
            return 'requerido'
        }
        if (!this.psicologoForm.controls[field].dirty || !this.psicologoForm.controls[field].errors) {
            return ''
        }
        if (this.psicologoForm.controls[field].hasError('required')) {
            return 'required'
        }

        if (this.psicologoForm.controls[field].hasError('minlength')) {
            return `The min length is ${this.psicologoForm.controls[field].getError('minlength')['requiredLength']}`
        }

        if (this.psicologoForm.controls[field].hasError('min')) {
            return `The min ${this.psicologoForm.controls[field].getError('min')['min']}`
        }

        if (this.psicologoForm.controls[field].hasError('max')) {
            return `The max ${this.psicologoForm.controls[field].getError('max')['max']}`
        }
        if (this.psicologoForm.controls[field].hasError('pattern')) {
            return 'Formato de documento no valido'
        }
        if (this.psicologoForm.controls[field].hasError('requiredTrue')) {
            return 'Es necesario que se haya entregado el documento'
        }
        return 'invalid'
    }

    /**
     * Da de alta un psicologo en BBDD
     */
    altaPsicologo() {
        const datos = {
            username: this.psicologoForm.controls['username'].value,
            nombre: this.psicologoForm.controls['nombre'].value,
            apellido1: this.psicologoForm.controls['apellido1'].value,
            apellido2: this.psicologoForm.controls['apellido2'].value,
            tipo_doc: this.psicologoForm.controls['tipo_doc'].value,
            documento: this.psicologoForm.controls['documento'].value,
            titulacion: this.psicologoForm.controls['titulacion'].value,
            especialidad: this.psicologoForm.controls['especialidad'].value,
            credenciales_adic: this.psicologoForm.controls['credenciales_adic'].value,
            num_colegiado: this.psicologoForm.controls['num_colegiado'].value,
            telefono: this.psicologoForm.controls['telefono'].value,
            email: this.psicologoForm.controls['email'].value,
            direccion: {
                calle: this.psicologoForm.controls['calle'].value,
                cod_postal: this.psicologoForm.controls['cod_postal'].value,
                ciudad: this.psicologoForm.controls['ciudad'].value,
                provincia: this.psicologoForm.controls['provincia'].value,
                pais: this.psicologoForm.controls['pais'].value,
            },
        };
        const login = {
            email: this.psicologoForm.controls['email'].value,
            username: this.psicologoForm.controls['username'].value,
            password: 'psicologo' + (new Date()).getFullYear(),
            roles: ['psicologo']
        };

        if (this.psicologoForm.valid) {
            let sus = this.service.signup(login).subscribe({
                next: value => {
                    this.serv.altaPsicologo(datos).subscribe();
                    this.toastr.success('', "Psicólogo creado correctamente.")
                    this.resertearFormulario()
                    this.psicologoForm.controls['tipo_doc'].setValue('DNI')
                    this.psicologoForm.controls['pais'].setValue('España')
                    this.formClick = false
                },
                error: err => {
                    this.toastr.error('Error', "Error en servidor. Código: " + err.status)
                },
                complete: () => {
                    sus.unsubscribe()
                }
            });
        }
    }

    modificarPsicologo() {
        const datos = {
            nombre: this.psicologoForm.controls['nombre'].value,
            apellido1: this.psicologoForm.controls['apellido1'].value,
            apellido2: this.psicologoForm.controls['apellido2'].value,
            tipo_doc: this.psicologoForm.controls['tipo_doc'].value,
            documento: this.psicologoForm.controls['documento'].value,
            titulacion: this.psicologoForm.controls['titulacion'].value,
            especialidad: this.psicologoForm.controls['especialidad'].value,
            credenciales_adic: this.psicologoForm.controls['credenciales_adic'].value,
            num_colegiado: this.psicologoForm.controls['num_colegiado'].value,
            telefono: this.psicologoForm.controls['telefono'].value,
            email: this.psicologoForm.controls['email'].value,
            direccion: {
                calle: this.psicologoForm.controls['calle'].value,
                cod_postal: this.psicologoForm.controls['cod_postal'].value,
                ciudad: this.psicologoForm.controls['ciudad'].value,
                provincia: this.psicologoForm.controls['provincia'].value,
                pais: this.psicologoForm.controls['pais'].value,
            },
        };

        let sus = this.serv.modificarPsicologoById(datos, this._psicologo!._id,).subscribe({
            next: value => {
                this.toastr.success('', 'Modificación realizada correctamente')
                this.formClick = false
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
        })
    }

    /**
     * Carga la lista de psicologos
     */
    cargarPsicologos() {
        this.t_psicologo = [];
        this.t_psicologo[0] = {
            _nombre: '',
            _valor: ''
        }
        let sus = this.serv.getPsicologos().subscribe({
            next: valor => {
                for (const iterator of valor) {
                    let registro: listaPsicologos = {
                        _nombre: iterator.nombre + " " + iterator.apellido1 + " " + iterator.apellido2,
                        _valor: iterator.username
                    }
                    this.t_psicologo.push(registro)
                }
            },
            complete: () => {
                sus.unsubscribe()
            }
        })
    }

    /**
     * Recupera los datos del psicologo seleccionado y los muestra por pantalla
     * @param username
     */
    obtenerDatosPsicologo(username: any) {
        this.resertearFormulario();
        let sus = this.serv.getPsicologoByUser(username.value).subscribe({
            next: dato => {
                this._psicologo = dato;
                this.psicologoForm.controls['nombre'].setValue(this._psicologo.nombre)
                this.psicologoForm.controls['apellido1'].setValue(this._psicologo.apellido1)
                this.psicologoForm.controls['apellido2'].setValue(this._psicologo.apellido2)
                this.psicologoForm.controls['tipo_doc'].setValue(this._psicologo.tipo_doc)
                this.psicologoForm.controls['documento'].setValue(this._psicologo.documento)
                this.psicologoForm.controls['titulacion'].setValue(this._psicologo.titulacion)
                this.psicologoForm.controls['especialidad'].setValue(this._psicologo.especialidad)
                this.psicologoForm.controls['credenciales_adic'].setValue(this._psicologo.credenciales_adic)
                this.psicologoForm.controls['num_colegiado'].setValue(this._psicologo.num_colegiado)
                this.psicologoForm.controls['telefono'].setValue(this._psicologo.telefono)
                this.psicologoForm.controls['email'].setValue(this._psicologo.email)
                this.psicologoForm.controls['calle'].setValue(this._psicologo.direccion.calle)
                this.psicologoForm.controls['cod_postal'].setValue(this._psicologo.direccion.cod_postal)
                this.psicologoForm.controls['ciudad'].setValue(this._psicologo.direccion.ciudad)
                this.psicologoForm.controls['provincia'].setValue(this._psicologo.direccion.provincia)
                this.psicologoForm.controls['pais'].setValue(this._psicologo.direccion.pais)
            },
            complete: () => {
                sus.unsubscribe()
            }
        })
    }

    resertearFormulario() {
        this.psicologoForm.reset()
        if (this.tipo === "modificar") {
            this.cargarPsicologos();
        }
    }
}
