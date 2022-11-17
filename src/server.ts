
import Fastify from 'fastify'
import cors from '@fastify/cors'

import { PoolsRoutes } from './routes/pool'
import { AuthRoutes } from './routes/auth';
import { gameRoutes } from './routes/game';
import { guessRoutes } from './routes/guess';
import { UserRoutes } from './routes/user';
import jwt from '@fastify/jwt'

async function bootstrap() 
{
    const fastify = Fastify({
        logger:true,
    })

    await fastify.register(cors, {
        origin: true,
    })
// Em produção isso precisa ser uma variável de ambiente
    await fastify.register(jwt,{
        secret:'nlwcopa',
    })

        await fastify.register(PoolsRoutes)
        await fastify.register(AuthRoutes)
        await fastify.register(gameRoutes)
        await fastify.register(guessRoutes)
        await fastify.register(UserRoutes)
       
      

    await fastify.listen({port:3333/*,host:'0.0.0.0'*/})
    
}
bootstrap()