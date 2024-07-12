import fastify, { FastifyInstance } from 'fastify';
import { register } from './controllers/users/register.controller';

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register);
}
