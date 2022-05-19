import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Document } from '../clases/Documento';


@Injectable({
  providedIn: 'root'
})
export class DocumentServiceService {
  currentDocument = this.socket.fromEvent<Document>('document');
  documents = this.socket.fromEvent<[]>('documents');

  constructor(private socket: Socket) { }

  getDocument(id: string) {
    this.socket.emit('getDoc', id);
  }
  borrarDocumento(id:string){
    this.socket.emit('borrarDoc', id);

  }

  newDocument(document:Document) {
    this.socket.emit('addDoc', document);
  }

  editDocument(document: Document) {
    this.socket.emit('editDoc', document);
  }
  userConectado(name: "cristtian") {
    this.socket.emit('userConec', name);
  }
  


}