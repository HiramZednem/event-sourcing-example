import { Repository } from '../../ports/Repository';

export class GetUserEvents {
  constructor(private repository: Repository) {}

  async execute(userId: string): Promise<any[]> {
    return this.repository.getEventsByUserId(userId);
  }
}
