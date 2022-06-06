import { Component, Input, OnInit } from '@angular/core';
import {FormControl,FormGroup, Validators} from '@angular/forms';
import { UsuriosService } from '../../../servicios/usurios.service';
import { Foto } from '../../../clases/foto';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { MessageService } from 'src/app/servicios/message.service';

@Component({
  selector: 'app-subir-foto',
  templateUrl: './subir-foto.component.html',
  styleUrls: ['./subir-foto.component.scss']
})

export class SubirFotoComponent implements OnInit {

  public archivo={
    nombreArchivo:null,
    base64textString:""
  };
  contacForm:FormGroup
  fotoPrincipal=""

  closeResult = '';
  video:any
  type = ""
  srcFotoSeleccionada = ""

  breakpoint!:boolean
  fotoBotonStr:string = "" 
  @Input()
  veterinario!:boolean
  constructor(private message:MessageService,private modalService: NgbModal,private userService:UsuriosService,private jwt:JwtHelperService) { 
    this.contacForm =new FormGroup({
        
      titulo: new FormControl('',[Validators.required, Validators.minLength(5)]),
      descripcion: new FormControl('',[Validators.required]),
      foto: new FormControl('',[Validators.required]),
    
      });
  }

  ngOnInit(): void {
    
    this.detectarBreakPoint()
  }
  
  addFoto(){
    
    let titulo=this.contacForm.controls["titulo"].value
    let descrpcion= this.contacForm.controls["descripcion"].value
    let emailFoto=this.jwt.decodeToken(localStorage.getItem("token") !).sub.email;
    let dataFoto="data:image/png;base64,"+this.archivo.base64textString.trim()
    
    if(dataFoto.length>25){
         let foto = new Foto(titulo,descrpcion,dataFoto,emailFoto,0,0,[],[],new Date(),"user");
         this.userService.addImage(foto).subscribe((m)=>{
            this.message.createMessage("Se subio a tu galeria")
            
          })
          this.modalService.dismissAll()
    }else{
      this.message.createMessage("No se ha añadido ninguna foto")
    }
    
  }
  fileEvent(event: any){
    var files=event.target.files;
    var file=files[0];
    this.archivo.nombreArchivo=file.name;
    if(file && files)    {

      var reader = new FileReader();
      reader.onload=this._handleReaderLoader.bind(this);  
      reader.readAsBinaryString(file);
    }
    
   }
   _handleReaderLoader(readerEvent:any){
    var binaryString=readerEvent.target.result;
    this.archivo.base64textString=btoa(binaryString);
    this.srcFotoSeleccionada ="data:image/jpg;base64,"+this.archivo.base64textString
   
    
  }
  open(content: any) {

      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

 

  
  private fileChangeListener($event:any ) {
    let fileList: FileList = $event.target.files;
  
    if (fileList.length > 0) {
        let file: File = fileList[0];
        console.log('video seleccionado', file);
        let myReader: FileReader = new FileReader();
        let that = this;
        myReader.onloadend = (loadEvent: any) => {
            this.video = myReader.result;
            this.type = file.type;
        };
        myReader.readAsDataURL(file);
    }
}

detectarBreakPoint() {
  let width = window.innerWidth;
  this.breakpoint = width < 576 ? true : false;
  this.fotoBotonStr = this.breakpoint
    ? ''
    : 'Foto';
 
}
}