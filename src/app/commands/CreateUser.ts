import { Repository } from '../../ports/Repository';

export class CreateUser {
  constructor(private repository: Repository) {}

  async execute(id: string, name: string, email: string): Promise<void> {
    const event = { type: 'UserCreated', data: { id, name, email } };
    await this.repository.saveEvent(event);
    await this.repository.saveProjection('users', { id, name, email });
  }
}
