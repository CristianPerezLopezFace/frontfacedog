import { Component, HostListener, OnInit } from '@angular/core';
import { Data, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Notificacion } from '../../clases/notificacion';
import { UsuriosService } from '../../servicios/usurios.service';
import { MatDialog } from '@angular/material/dialog';
import { Foto } from 'src/app/clases/foto';
import { NotificacionComponent } from '../notificacion/notificacion.component';
import { Usuario } from 'src/app/clases/usuario';
import { ActualizarUserComponent } from '../actualizar-user/actualizar-user.component';










@Component({
  selector: 'app-menu-nav',
  templateUrl: './menu-nav.component.html',
  styleUrls: ['./menu-nav.component.scss'],
})




export class MenuNavComponent implements OnInit {
  nombreUsuario: string = this.jwt.decodeToken(localStorage.getItem('token')! ).sub.name;;
  dataFotoPrincipal = '';
  nombreNotifi = '';
  tipo = '';
  fechaNotifi!: Date;
  notificaciones: Notificacion[] = [];
  emailUser = this.jwt.decodeToken(localStorage.getItem('token')!).sub
      .email;
  listaTemporal:any;
  rol = this.jwt.decodeToken(localStorage.getItem('token')!).sub.roles;;

  repetir = true;
  closeResult = '';

  foto!: Foto;
;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private userService: UsuriosService,
    private jwt: JwtHelperService,
  ) {}

  ngOnInit() {
    this.getNotificaion()  
  }

  inicio(){
    if(this.rol == "Usuario"){  
        this.router.navigate(['home/inicio'])
    }else if(this.rol == "Veterinario"){  
      this.router.navigate(['home/veterinario'])
    }
      
  }
  amigos(){
    this.router.navigate(['home/amigos'])
  }
  zonas(){
    this.router.navigate(['home/zonas'])
  }
  consultas(){
    
    this.router.navigate(['home/consultas'])
  }
  ngOnDestroy(): void {
    console.log("destruyendo el NAV")

  }



  existToken() {
    let token = localStorage.getItem('token');
    return token != null ? true : false;
  }
  logout() {
    this.router.navigate(['']);
    localStorage.removeItem('token');
  }

  getNotificaion() {
  
    this.userService.getNotificacion(this.emailUser).subscribe((notificaciones) => {
       this.notificaciones = notificaciones
 
    });

  }

  openDialog(noti: Notificacion) {
    const dialogRef = this.dialog.open(NotificacionComponent  ,{
      width: '700px',
      height : '500px',
      data: {
        notificaion:noti,
        
      }
    })

    dialogRef.afterClosed().subscribe(result => {
          this.ngOnInit()
    });

  
  }
  
 async openDialogSetting() {
    let usuario = await this.userService.get_one_user(this.emailUser).toPromise()
    const dialogRef = this.dialog.open(ActualizarUserComponent  ,{
      width: '700px',
      height : '500px',
      data: {
        user:usuario,
        
      }
    })
}
  }