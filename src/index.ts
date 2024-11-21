import { MongoClient } from 'mongodb';
import { MongoRepository } from './infrastructure/db/MongoRepository';
import { CreateUser } from './app/commands/CreateUser';
import { GetUser } from './app/queries/GetUser';
import { UpdateUser } from './app/commands/UpdateUser';
import { DeleteUser } from './app/commands/DeleteUser';
import { GetUserEvents } from './app/queries/GetUserEvents';
import { GetAllUsers } from './app/queries/GetAllUsers';
import { Server } from './infrastructure/http/Server';
import { MONGO_URI, PORT, RABBITMQ_URL } from './config/dotenvConfig';

(async () => {
  const client = new MongoClient(MONGO_URI);
  const repository = new MongoRepository(client, 'eventsourcing');
  await repository.connect();

  const createUser = new CreateUser(repository);
  const getUser = new GetUser(repository);
  const updateUser = new UpdateUser(repository);
  const deleteUser = new DeleteUser(repository);
  const getUserEvents = new GetUserEvents(repository);
  const getAllUsers = new GetAllUsers(repository);

  const server = new Server(createUser, getUser, updateUser,deleteUser, getUserEvents, getAllUsers, RABBITMQ_URL);
  await server.initialize();
  server.listen(PORT);
})();
