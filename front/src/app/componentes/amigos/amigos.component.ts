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
  palabraBuscar=""

  constructor(private message:MessageService,private comunicacion:ComunicacionComponentsService,private userService:UsuriosService,private router:Router,private jwt:JwtHelperService) { }

  async ngOnInit(): Promise<void> {
    await this.getAmigos()
    await this.getAllUsers()
  }
  async getAmigos(){
      this.sonAmigos=true
      let emailUser=this.jwt.decodeToken(localStorage.getItem("token") !).sub.email;
      let misAmigos =await  this.userService.getAmigos(emailUser).toPromise()
      this.amigos=[]
      this.usuarios = []
      misAmigos.forEach((amigo: Amigo) => {
        this.amigos.push(amigo.id)
        this.usuarios.push(amigo)    
      }) 
      
  }
  async getAllUsers()  {
    this.sonAmigos=false
    this.usuarios=[]
    let usuarios = await this.userService.getAllUsers().toPromise()
    usuarios.forEach(usuario => {
      if(!this.amigos.includes(usuario.id)){
        this.usuarios.push(usuario)
      }
    })
   
  }
  async getAllUserByCity(){

    this.sonAmigos=false
    this.userService.getAllUsers().subscribe(usuarios =>{
        this.usuarios=[]
         usuarios.forEach(usuario => {
           if(usuario.ciudad == this.ciudad_user){
              this.usuarios.push(usuario)
           }
         })
    }) 
 
  }
  async buscarAmigo(){

    this.sonAmigos=false
    this.userService.getAllUsers().subscribe(usuarios =>{
        this.usuarios=[]
         usuarios.forEach(usuario => {
           console.log(this.palabraBuscar)
           if(usuario.name == this.palabraBuscar){
              this.usuarios.push(usuario)
           }
         })
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
