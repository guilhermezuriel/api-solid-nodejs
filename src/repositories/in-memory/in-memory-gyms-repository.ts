import { Gym, Prisma, User } from '@prisma/client';
import { UsersRepository } from '../users-repository';
import { randomUUID } from 'node:crypto';
import { GymsRepository } from '../gyms-repository';

export class InMemoryGymsRepository implements GymsRepository {
  findById(id: string): Promise<Gym | null> {
    throw new Error('Method not implemented.');
  }
  public items: Gym[] = [];
}
