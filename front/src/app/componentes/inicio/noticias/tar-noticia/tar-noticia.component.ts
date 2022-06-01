import { Component, Input, OnInit, Output } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Amigo } from 'src/app/clases/amigo';
import { Comentario } from 'src/app/clases/comentario';
import { Foto } from 'src/app/clases/foto';
import { UsuriosService } from '../../../../servicios/usurios.service';
import { formatDate } from '@angular/common';
import { Notificacion } from 'src/app/clases/notificacion';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/servicios/message.service';
import { MatDialog } from '@angular/material/dialog';
import { AmpliarFotoComponent } from 'src/app/componentes/ampliar-foto/ampliar-foto.component';
import { DocumentServiceService } from 'src/app/servicios/documentService.service';
import { Usuario } from 'src/app/clases/usuario';
@Component({
  selector: 'app-tar-noticia',
  templateUrl: './tar-noticia.component.html',
  styleUrls: ['./tar-noticia.component.scss'],
})
export class TarNoticiaComponent implements OnInit {
  
  misNoticias: Foto[] = [];
  panelOpenState = false;
  comentarOk = false;
  value: string = ' ';
  id_user = this.jwt.decodeToken(localStorage.getItem('token')!).sub.id;
  email_user = this.jwt.decodeToken(localStorage.getItem('token')!).sub.email;
  ok: boolean | undefined;
  sinAmigos: boolean = false;

  mostrar: boolean = false;

  nameUserNoticia = ""
  nombresLike:Usuario[]=[]

  @Input()
  foto!: Foto;

  @Input()
  id_foto!: number;
  @Input()
  veterinario!:boolean
  constructor(
    
    public dialog: MatDialog,
    private message: MessageService,
    private userService: UsuriosService,
    private jwt: JwtHelperService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getImagen();
    this.getNombreUsuario(this.foto.email)
    
  
  }


  async getImagen() {
    if (this.id_foto == undefined) {
      this.foto = await  this.userService.getImage(this.foto.id).toPromise()        
    }
  }

  ver() {
    this.mostrar = this.mostrar == false ? true : false;
    return this.mostrar;
  }
  activarComentarios() {
    this.comentarOk = !this.comentarOk;
  }
  async comentar(idFoto: number, emailDestinatario: string, foto: Foto) {
    let email = this.jwt.decodeToken(localStorage.getItem('token')!).sub.email;
    let name = this.jwt.decodeToken(localStorage.getItem('token')!).sub.name;
    let formattedDt = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss', 'en_US');
    let comentario: Comentario = new Comentario(
      0,
      idFoto,
      email,
      name,
      this.value,
      formattedDt,
      []
    );
    if (this.value != '') {
      await  this.userService.createComentario(comentario).toPromise()
      this.getImagen();
      this.ngOnInit();
      this.message.createMessage('Comentario realizado');
      if(this.email_user != emailDestinatario){
         this.notificarComentario(emailDestinatario, idFoto);
      }
    }
  }

  notificarComentario(emailDestinatario: string, id: number) {
      let nameUser = this.jwt.decodeToken(localStorage.getItem('token')!).sub
        .name;
      let emailUser = this.jwt.decodeToken(localStorage.getItem('token')!).sub
        .id_fotos;
      let tipoNoti = 'comentario en foto';
      if(emailUser != emailDestinatario){
      
            let notificacion = new Notificacion(
              id,
              emailUser,
              nameUser,
              tipoNoti,
              emailDestinatario,
              new Date()
            );
            this.userService.setNotificaion(notificacion).subscribe((e) => {});
      }
  }

  like(id_foto: number) { 
    this.userService.addLikeImg(id_foto, this.id_user).subscribe((e) => {  
         this.getImagen();
         this.ngOnInit()
    });
  }

  async likeComent(id_foto: number, emailUser: string, posicion: number) {
    this.ok = true;
    let user = await this.userService.get_one_user(emailUser).toPromise()
    await this.userService.addLikeComentario(id_foto, user.id, posicion).toPromise()  
    this.getImagen();
    this.ngOnInit();  
  }

  amigos() {
    this.router.navigate(['/amigos']);
  
  }
  async getNombresLike(idFoto:number){
      
      this.nombresLike=[]   
      this.nombresLike = await this.userService.getNombresLikesFoto(idFoto).toPromise()
      
  }
  openDialog(foto:Foto) {
    const dialogRef = this.dialog.open(AmpliarFotoComponent,{

      data: {
        foto:foto
      }
    })

    dialogRef.afterClosed().subscribe(result => {

      console.log(`Dialog result: ${result}`);
    });

    dialogRef.afterClosed().subscribe(result => {
  
    })
    }
    async getNombreUsuario(email:string){
      let user = await this.userService.get_one_user(email).toPromise()
      this.nameUserNoticia = user.name
    }
  
}
