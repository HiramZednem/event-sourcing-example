import { MongoClient, Db } from 'mongodb';
import { Repository } from '../../ports/Repository';
import { Event } from '../../domain/Event';

export class MongoRepository implements Repository {
  private db!: Db;

  constructor(private client: MongoClient, private dbName: string) {}

  async connect(): Promise<void> {
    await this.client.connect();
    this.db = this.client.db(this.dbName);
    console.log(`Connected to MongoDB: ${this.dbName}`);
  }

  async saveEvent(event: Event): Promise<void> {
    const collection = this.db.collection('events');
    await collection.insertOne({ ...event, timestamp: new Date() });
  }

  async getEventsByUserId(userId: string): Promise<Event[]> {
    const collection = this.db.collection('events');
    const documents = await collection.find({ 'data.id': userId }).toArray();
    return documents.map(doc => ({
        type: doc.type,
        data: doc.data,
        timestamp: doc.timestamp,
    } as Event));
}


  async saveProjection(collection: string, data: any): Promise<void> {
    await this.db.collection(collection).insertOne(data);
  }

  async updateProjection(collection: string, filter: any, data: any): Promise<void> {
    await this.db.collection(collection).updateOne(filter, { $set: data });
  }

  async deleteProjection(collection: string, filter: any): Promise<void> {
    await this.db.collection(collection).deleteOne(filter);
  }

  async getProjection(collection: string, filter: any): Promise<any> {
    return this.db.collection(collection).findOne(filter);
  }

  async getAllProjections(collection: string): Promise<any[]> {
    return this.db.collection(collection).find().toArray();
  }
}
