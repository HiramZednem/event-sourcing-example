import { Repository } from '../../ports/Repository';

export class GetUser {
  constructor(private repository: Repository) {}

  async execute(id: string): Promise<any> {
    return this.repository.getProjection('users', { id });
  }
}
