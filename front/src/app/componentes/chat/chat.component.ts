import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  HostListener,
  Input,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DocumentServiceService } from '../../servicios/documentService.service';
import { startWith } from 'rxjs/operators';
import { Document, Doc } from '../../clases/Documento';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  document!: Document;
  private _docSub!: Subscription;
  token = this.jwt.decodeToken(localStorage.getItem('token')!).sub.email;

  value: string = '';
  textoMostrar = '';
  documents!: Observable<[]>;
  currentDoc!: string;
  email = this.jwt.decodeToken(localStorage.getItem('token')!).sub.email;

  contadorMenss = 0;
  repetir = true;
  closeResult = '';

  usuariosConectados=[]
  titulo:string=""
  ultimoScroll=0
  @Input()
  consulta!: boolean;

  constructor(
    private documentService: DocumentServiceService,
    private jwt: JwtHelperService
  ) {}
  // @ViewChild('chat') element: ElementRef | undefined;

  ngAfterViewInit() {}
  miMensaje(email: string) {
    return this.email == email ? true : false;
  }
  ngOnInit() {
    this.cargarDocumento();
    this.contadorMenss = this.document.doc.length;

    this.newDoc();

    this.loadDoc('chat');

    setTimeout(() => {this.scroll()}, 100);
    this.titulo = this.consulta ? "Chat veterinario"  : "Chat global"

  }

  cargarDocumento() {
    this.token = this.jwt.decodeToken(localStorage.getItem('token')!).sub.email;
    let name: string = this.jwt.decodeToken(localStorage.getItem('token')!).sub
      .name;

    let listaDoc: Doc[] = [];
    let docu = new Doc(
      name,
      '',
      new Date(),
      this.email
    );
    listaDoc.push(docu);
    this._docSub = this.documentService.currentDocument
      .pipe(startWith(new Document(name, listaDoc, this.token, [])))
      .subscribe((document) => {
        this.document = document;
      });
  }

  editDoc() {
    let name: string = this.jwt.decodeToken(localStorage.getItem('token')!).sub
      .name;
    let frase = this.value;

    if(this.consulta){
      let doc = new Doc(name, frase, new Date(), this.email);
      this.document.chatVeterinario.push(doc)
    }else{
      let doc = new Doc(name, frase, new Date(), this.email);
      this.document.doc.push(doc);

    }
    this.documentService.editDocument(this.document);
    this.value = '';
    setTimeout(() => this.scroll(), 100);
  }
  ngOnDestroy() {
    
  }

  loadDoc(id: string) {
    this.documentService.getDocument(id);
  }
    


  newDoc() {

    let email = this.jwt.decodeToken(localStorage.getItem('token')!).sub.email;
    let token = this.jwt.decodeToken(localStorage.getItem('token')!);
    let chatVeter:Doc[]=[]
    
    let doc = new Doc('', '', new Date(), email);
    let docs: Doc[] = [];
    docs.push(doc);
    let document;
   document = new Document('chat', docs, token, chatVeter);

    this.documentService.newDocument(document);
  }
  levantaTecla(event: any) {
    if (event.keyCode == 13) {
      this.editDoc();
      setTimeout(() => this.scroll(), 100);
    }
  }
  scroll() {
    let contenedorChat = document.getElementsByName('tarjet')[0];
    contenedorChat.scrollTop = contenedorChat.scrollHeight;
    this.ultimoScroll=contenedorChat.scrollHeight
  }
  mensajesSinVer() {
    let contenedorChat = document.getElementsByName('tarjet')[0].scrollHeight;
    return this.ultimoScroll < contenedorChat 
  }


}
