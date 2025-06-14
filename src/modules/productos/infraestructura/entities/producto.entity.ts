import { Column, Entity, PrimaryColumn } from 'typeorm';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@Entity({ name: 'productos' })
export class Producto {
  @PrimaryColumn()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @Column()
  @IsString()
  descripcion: string;

  @Column({ name: 'preciopersonas' })
  @IsNotEmpty()
  @IsNumber()
  precioPersonas: number;

  @Column({ name: 'precioempresas' })
  @IsNotEmpty()
  @IsNumber()
  precioEmpresas: number;

  @Column()
  @IsNotEmpty()
  @IsBoolean()
  stock: boolean;

  @Column({ name: 'urlimagen' })
  @IsString()
  urlImagen?: string;

  constructor(
    id: number,
    nombre: string,
    descripcion: string,
    precioPersonas: number,
    precioEmpresas: number,
    stock: boolean,
    urlImagen: string,
  ) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precioPersonas = precioPersonas;
    this.precioEmpresas = precioEmpresas;
    this.stock = stock;
    this.urlImagen = urlImagen;
  }
}
