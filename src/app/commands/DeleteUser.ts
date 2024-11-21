import { Repository } from '../../ports/Repository';

export class DeleteUser {
  constructor(private repository: Repository) {}

  async execute(id: string): Promise<void> {
    const event = { type: 'UserDeleted', data: { id } };
    await this.repository.saveEvent(event);
    await this.repository.deleteProjection('users', { id });
  }
}
