import { Cliente } from 'src/modules/cliente/infraestructura/entities/cliente.entity';
import { CreateClienteDto } from '../../dto/crear-cliente.dto';

export interface ClienteRepository {
  obtenerTodos(): Cliente[] | PromiseLike<Cliente[]>;
  alta(cliente: CreateClienteDto);
}
