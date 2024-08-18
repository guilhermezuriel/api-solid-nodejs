import { Gym, Prisma } from '@prisma/client';

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>;
  create(data: Prisma.GymCreateInput): Promise<Gym>;
  findManyNearby(latitude: number, longitude: number): Promise<Gym[]>;
  searchMany(query: string, page: number): Promise<Gym[]>;
}
