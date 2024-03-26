import fastify from 'fastify';
import { PrismaClient } from '@prisma/client';

const app = fastify();
const prisma = new PrismaClient();

prisma.user.create({
  data: {
    name: 'Guilherme Zuriel',
    email: 'guizuriel@email.com',
  },
});

export default app;
