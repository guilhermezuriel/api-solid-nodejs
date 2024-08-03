import { Gym, Prisma, User } from '@prisma/client';
import { UsersRepository } from '../users-repository';
import { randomUUID } from 'node:crypto';
import { GymsRepository } from '../gyms-repository';
import { title } from 'node:process';

export class InMemoryGymsRepository implements GymsRepository {
  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = {
      id: randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    };

    this.items.push(gym);

    return gym;
  }
  async findById(id: string): Promise<Gym | null> {
    const gymId = this.items.find((item) => item.id === id);
    if (!gymId) {
      return null;
    }
    return gymId;
  }
  public items: Gym[] = [];
}
