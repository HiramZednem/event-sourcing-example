import { Repository } from '../../ports/Repository';

export class GetAllUsers {
  constructor(private repository: Repository) {}

  async execute(): Promise<any[]> {
    return this.repository.getAllProjections('users');
  }
}
