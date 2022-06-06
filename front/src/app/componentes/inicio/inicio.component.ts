import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import { MessageService } from 'src/app/servicios/message.service';
import { UserRegisterService } from 'src/app/servicios/user-register.service';

import { Foto } from '../../clases/foto';
import { UsuriosService } from '../../servicios/usurios.service';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent implements OnInit {


  allImg: Foto[] = [];
  foto!: Foto;

  idFotoSeleccionada: number | undefined;
  dataFotoPrincipal = '';
  mostrarGaleria = false;
  rol = this.jwt.decodeToken(localStorage.getItem('token')!).sub.roles;
  srcCargando = `../assets/cargango.gif`;

  like: boolean | undefined;

  abrirChat: boolean = true;

  cssUrl!: string;
  srcUrl: any;

  botonClicado = '';


  //nombres de botones
  
  galeria : string = ""
  consultasStr : string= ""
  usuarios:string = ""
  chat : string = ""
  breakpoint!: boolean;


  constructor(
    public sanitizer: DomSanitizer,
    
    private message: MessageService,
    private servicioUsuario: UsuriosService,
    private router: Router,
    private jwt: JwtHelperService,
    private userRegisterService:UserRegisterService
  ) {
    this.cssUrl = `../shared/styles2.scss`;
  }
  ngOnInit(): void {

    this.userRegisterService.tokenExpired(localStorage.getItem("token")!)

    this.detectarBreakPoint()
    
  }

  getAllImageUser() {
    let nameEmail = this.jwt.decodeToken(localStorage.getItem('token')!).sub
      .email;

    this.allImg = [];
    this.servicioUsuario.getAllImg(nameEmail).subscribe((data) => {
      data.forEach((e) => this.allImg.push(e));
    
    });
  }
  mostrarGale() {
    this.router.navigate(['/home/galeria']);

  }
  activarSocial() {
    this.allImg = [];
    this.botonClicado = 'social';
  }

  amigos(){
    this.router.navigate(['home/amigos'])
  }
 

  activarChat() {
    this.abrirChat = this.abrirChat == true ? false : true;
    this.botonClicado = 'chat';
  }

  changeStyle() {
    console.log('estiloss');
    this.cssUrl =
      this.cssUrl === `/shared/styles2.scss`
        ? `/shared/styles3.scss`
        : `./shared/styles2.scss`;
    let srcUr = this.sanitizer.bypassSecurityTrustUrl(this.cssUrl);
    this.srcUrl = srcUr;
  }
  personas(){
    this.router.navigate(['home/amigos'])
  }

  consultas(){
    
    this.router.navigate(['home/consultas'])
  }
  detectarBreakPoint() {
    let width = window.innerWidth;
    this.breakpoint = width < 576 ? true : false;
    this.galeria = this.breakpoint
      ? ''
      : 'Galeria';
    this.consultasStr = this.breakpoint ? '' : 'Consultas';
    this.usuarios= this.breakpoint
      ? ''
      : 'Usuarios';
    this.chat = this.breakpoint ? '' : 'Chat'
  }
}
