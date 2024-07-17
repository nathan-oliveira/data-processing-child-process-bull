import { MongoClient } from 'mongodb';
import { DataSource } from 'typeorm';

export class ConnectionConfig {
  private static mongoClients: Map<string, MongoClient> = new Map();
  private static postgresClients: Map<string, DataSource> = new Map();

  static async getMongoDBConnection(dbName: string, collectionName: string) {
    const mongoUrl = 'mongodb://root:example@localhost:27017';
    if (!ConnectionConfig.mongoClients.has(mongoUrl)) {
      const client = new MongoClient(mongoUrl);
      try {
        await client.connect();
        ConnectionConfig.mongoClients.set(mongoUrl, client);
      } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
      }
    }

    const client = ConnectionConfig.mongoClients.get(mongoUrl);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    return { client, collection };
  }

  static async getPostgresConnection(
    schemaName: string,
    databaseName = 'postgres',
  ) {
    const postgresUrl = 'postgres://username:password@host:port/database';
    if (!ConnectionConfig.postgresClients.has(postgresUrl)) {
      try {
        const client = new DataSource({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'postgres',
          database: databaseName,
          schema: schemaName,
        });

        await client.initialize();
        ConnectionConfig.postgresClients.set(postgresUrl, client);
      } catch (error) {
        console.error('Error connecting to PostgreSQL:', error);
        throw error;
      }
    }

    return { client: ConnectionConfig.postgresClients.get(postgresUrl) };
  }
}
