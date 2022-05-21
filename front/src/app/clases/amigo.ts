
export class Amigo {
    id:number
    email:string
    name : string
    foto:string
    ciudad:string
    descripcion: string
    id_fotos:string

    constructor(id:number,descripcion:string,name:string,foto:string,ciudad:string,id_foto:string,email:string){
        this.id=id
        this.email=email
        this.name=name;
        this.id_fotos=id_foto;
        this.foto=foto;
        this.ciudad=ciudad;
        this.descripcion=descripcion;
    
    }
}