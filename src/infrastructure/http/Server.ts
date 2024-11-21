import express, { Application, Request, Response } from 'express';
import { CreateUser } from '../../app/commands/CreateUser';
import { GetUser } from '../../app/queries/GetUser';
import { UpdateUser } from '../../app/commands/UpdateUser';
import { DeleteUser } from '../../app/commands/DeleteUser';
import { GetUserEvents } from '../../app/queries/GetUserEvents';
import { GetAllUsers } from '../../app/queries/GetAllUsers';
import { RabbitMQ } from '../../infrastructure/rabbitmq/rabbitmq';

export class Server {
  private app: Application;
  private rabbitMQ: RabbitMQ;

    constructor(
      private createUser: CreateUser,
      private getUser: GetUser,
      private updateUser: UpdateUser,
      private deleteUser: DeleteUser,
      private getUserEvents: GetUserEvents,
      private getAllUsers: GetAllUsers,
      rabbitMQUrl: string) {
      this.app = express();
      this.app.use(express.json());
      this.rabbitMQ = new RabbitMQ(rabbitMQUrl);
    }
    
    async initialize() {
      try {
        await this.rabbitMQ.connect(); // Conectar RabbitMQ antes de usarlo
        this.routes();
      } catch (error) {
        console.error('Error initializing RabbitMQ:', error);
        throw error;
      }
    }

  private routes(): void {
    this.app.post('/create-user', async (req: Request, res: Response) => {
      const { id, name, email } = req.body;
      await this.createUser.execute(id, name, email);

      // Enviar un mensaje a RabbitMQ cuando se crea un usuario
      const message = JSON.stringify({ id, name, email });
      await this.rabbitMQ.sendToQueue('usuario-creado', message);

      res.status(201).send({ message: 'Usuario creado' });
    });

    // get all users
    this.app.get('/users', async (req: Request, res: Response) => {
      const users = await this.getAllUsers.execute();
      res.send(users);
    });

    // get user by id
    this.app.get('/users/:id', async (req: Request, res: Response) => {
      const user = await this.getUser.execute(req.params.id);
      user ? res.send(user) : res.status(404).send({ message: 'Usuario no encontrado' });
    });

    // Update user
    this.app.put('/update-user/:id', async (req: Request, res: Response) => {
      const { id } = req.params;
      const { name, email } = req.body;
    
      try {
        await this.updateUser.execute(id, name, email);
    
        // Enviar un mensaje a RabbitMQ cuando se actualiza un usuario
        const message = JSON.stringify({ id, name, email });
        await this.rabbitMQ.sendToQueue('usuario-actualizado', message);
    
        // Envía una única respuesta al cliente
        res.status(201).send({ message: 'Usuario actualizado' });
      } 
        catch (error) {
          if (error instanceof Error) {
            console.error('Error al actualizar el usuario:', error.message);
            res.status(500).send({ message: 'Error al actualizar el usuario', error: error.message });
          } else {
            console.error('Error desconocido:', error);
            res.status(500).send({ message: 'Error desconocido' });
          }
        }
        
      });
    

    this.app.delete('/delete-user/:id', async (req: Request, res: Response) => {
      const { id } = req.params;
    
      try {
        await this.deleteUser.execute(id);
    
        // Envía el mensaje a RabbitMQ cuando se elimina un usuario
        await this.rabbitMQ.sendToQueue('usuario-eliminado', { id });
    
        // Solo envía la respuesta después de que todo termine correctamente
        res.send({ message: 'Usuario eliminado' });
      } catch (error) {
        console.error('Error al elimianr el usuario:', error);
    
        // Si ocurre un error, asegúrate de no llamar a res.send() más de una vez
        res.status(500).send({ message: 'Error al elimianr el usuario' });
      }
    });
    

    // Get events of a user
    this.app.get('/users/:id/events', async (req: Request, res: Response) => {
      const events = await this.getUserEvents.execute(req.params.id);
      events ? res.send(events) : res.status(404).send({ message: 'Eventos no encontrados' });
    });

  }

  public listen(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  }
}
