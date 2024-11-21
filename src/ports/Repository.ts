import { Event } from '../domain/Event';

export interface Repository {
  saveEvent(event: Event): Promise<void>;
  getEventsByUserId(userId: string): Promise<Event[]>;
  saveProjection(collection: string, data: any): Promise<void>;
  updateProjection(collection: string, filter: any, data: any): Promise<void>;
  deleteProjection(collection: string, filter: any): Promise<void>;
  getProjection(collection: string, filter: any): Promise<any>;
  getAllProjections(collection: string): Promise<any[]>;
}
