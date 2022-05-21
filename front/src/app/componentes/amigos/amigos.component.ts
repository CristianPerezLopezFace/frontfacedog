import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MessageService } from 'src/app/servicios/message.service';
import { Amigo } from '../../clases/amigo';
import { Notificacion } from '../../clases/notificacion';
import { ComunicacionComponentsService } from '../../comunicacion-components.service';
import { UsuriosService } from '../../servicios/usurios.service';

@Component({
  selector: 'app-amigos',
  templateUrl: './amigos.component.html',
  styleUrls: ['./amigos.component.scss']
})
export class AmigosComponent implements OnInit {
  
  sonAmigos:boolean=true
  usuarios:Amigo[]=[]
  amigos:number[]=[]
  id_user = this.jwt.decodeToken(localStorage.getItem('token')!).sub.id;
  ciudad_user = this.jwt.decodeToken(localStorage.getItem('token')!).sub.city

  constructor(private message:MessageService,private comunicacion:ComunicacionComponentsService,private userService:UsuriosService,private router:Router,private jwt:JwtHelperService) { }

  ngOnInit(): void {
    this.getAmigos()
    console.log(this.amigos.length," amigos")
  }
  getAmigos(){
      this.sonAmigos=true
      let emailUser=this.jwt.decodeToken(localStorage.getItem("token") !).sub.email;
      this.userService.getAmigos(emailUser).subscribe(amigos =>{
          this.amigos=[]
          amigos.forEach(amigo => {
            this.amigos.push(amigo.id)
            this.usuarios.push(amigo)    
          }) 
      })
  }
  async getAllUsers()  {
    this.sonAmigos=false
    this.usuarios=[]
    this.userService.getAllUsers().subscribe(usuarios =>{
         usuarios.forEach(usuario => {
           if(!this.amigos.includes(usuario.id)){
              this.usuarios.push(usuario)
           }
         })
         console.log("hola 1")
    })
  }
  async getAllUserByCity(){

    await this.getAllUsers()
    console.log("hola 2")

    this.usuarios.filter(usuario => {
      console.log(usuario.ciudad,this.ciudad_user)
      usuario.ciudad == this.ciudad_user
    })
  }
  solicitarAmistad(email:string){
   
    let nameUser=this.jwt.decodeToken(localStorage.getItem("token") !).sub.name;
    let emailUser=this.jwt.decodeToken(localStorage.getItem("token") !).sub.id_fotos;
    let tipoNoti="solicitud de amistad"
    let notificacion=new Notificacion(this.id_user,emailUser,nameUser,tipoNoti,email,new Date())
    this.userService.setNotificaion(notificacion).subscribe(e =>{

        this.message.createMessage("Solicitud enviada")
    })
  }
  verPerfil(emailAmigo:string){
       
       this.comunicacion.setemailAmigo(emailAmigo)
       this.router.navigate(['home/perfilamigo'])
     
  }
}
