
export class Usuario {

    id:number
    password:string
    name : string
    surName:string
    ciudad:string
    email : string
    roles:string
    descripcion:string
    habilitado:number

    constructor(password:string,name:string,surName:string,ciudad:string,email:string,roles:string,id:number,descrip:string,habilitado:number){
        this.id=id
        this.name=name;
        this.email=email;
        this.password=password;
        this.surName=surName;
        this.ciudad=ciudad;
        this.roles=roles;
        this.descripcion=descrip;
        this.habilitado=habilitado
    
    }
}