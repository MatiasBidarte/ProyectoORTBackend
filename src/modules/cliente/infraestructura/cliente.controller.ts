import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { CreateClienteDto } from '../dominio/dto/crear-cliente.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ClientePersona } from 'src/modules/cliente/infraestructura/entities/cliente-persona.entity';
import { ClienteEmpresa } from 'src/modules/cliente/infraestructura/entities/cliente-empresa.entity';
import { AltaCliente } from '../dominio/casosDeUso/AltaCliente';
import { ObtenerTodosCliente } from '../dominio/casosDeUso/ObtenerTodosCliente';

@Controller('cliente')
export class ClienteController {
  constructor(
    private readonly alta: AltaCliente,
    private readonly obtenerTodos: ObtenerTodosCliente,
  ) {}
  @Post()
  async add(@Body() clienteDto: CreateClienteDto) {
    try {
      let cliente: ClientePersona | ClienteEmpresa;
      if (clienteDto.discriminador === ClientePersona.discriminador) {
        cliente = plainToInstance(ClientePersona, clienteDto, {
          enableImplicitConversion: true,
        });
      } else {
        cliente = plainToInstance(ClienteEmpresa, clienteDto);
      }
      const errores = await validate(cliente as object);
      if (errores.length > 0) {
        const mensajes = errores.map((err) => ({
          propiedad: err.property,
          error: err.constraints
            ? Object.values(err.constraints)
            : ['Error desconocido'],
        }));
        throw new BadRequestException(JSON.stringify(mensajes));
      }
      await cliente.setPassword();
      return this.alta.ejecutar(cliente);
    } catch (ex) {
      if (ex instanceof BadRequestException) {
        const errorObject = JSON.parse(ex.message) as {
          propiedad: string;
          error: string[];
        }[];
        const errorMessage =
          errorObject[0]?.error?.join(', ') || 'Error desconocido';
        throw new BadRequestException({
          message: `Error al crear el cliente: ${errorMessage}`,
          statusCode: ex.getStatus(),
        });
      } else if (ex instanceof HttpException) {
        throw new HttpException(
          `El correo ${clienteDto.email} ya está en uso.`,
          ex.getStatus(),
        );
      } else {
        throw new InternalServerErrorException(
          'Error al crear el cliente: error desconocido',
        );
      }
    }
  }

  @Get()
  findAll() {
    return this.obtenerTodos.ejecutar();
  }

  @Get('Prueba')
  prueba() {
    return 'Hola';
  }
}
