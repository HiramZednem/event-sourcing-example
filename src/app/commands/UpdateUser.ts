import { Repository } from '../../ports/Repository';

export class UpdateUser {
  constructor(private repository: Repository) {}

  async execute(id: string, name: string, email: string): Promise<void> {
    const event = { type: 'UserUpdated', data: { id, name, email } };
    await this.repository.saveEvent(event);
    await this.repository.updateProjection('users', { id }, { name, email });
  }
}
