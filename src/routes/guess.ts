import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { authenticate } from '../plugins/authenticate';
import { prisma } from './../lib/prisma';


export async function guessRoutes(fastify:FastifyInstance){
    fastify.get('/guesses/count', async ()=>{
        const count = await prisma.guess.count()
        return {count}
    })
    fastify.post('/apostas/:poolId/games/:gameId/guesses',{
        onRequest:[authenticate]
    },async (request,reply)=>{
        const createGuessParam = z.object({
            poolId:z.string(),
            gameId:z.string(),
        })
        const createGuessBody = z.object({
            firstTeamPoinst:z.number(),
            secontTeamPoints:z.number(),
        })

       
        const{poolId,gameId} = createGuessParam.parse(request.params)
        const{firstTeamPoinst,secontTeamPoints} = createGuessBody.parse(request.body)

        const participant = await prisma.participant.findUnique({
           where:{
            userId_poolId:{
                poolId,
                userId:request.user.sub,
            }
           }
        })
        

        if(!participant){
            return reply.status(400).send({
                message:"You're do not allowed to create a guess inside this pool "
            })
        }
        const game = await prisma.game.findUnique({
            where:{
                id:gameId,
            }
        })
       
        if(!game){
            return reply.status(400).send({
                message:"Game not found"
            })
        }

        if(game.date < new Date()){
            return reply.status(400).send({
                message:"You cannot send a guesses after the game date"
            })
        }

        const guess = await prisma.guess.findUnique({
            where:{
                participantId_gameId:{
                    participantId: participant.id,
                    gameId,
                }
            }
        })
        if(guess){
            return reply.status(400).send({
                message:"You alread sent a guess to this pool."
            })
        }
        await prisma.guess.create({
            data:{
                gameId,
                participantId: participant.id,
                firstTeamPoinst,
                secontTeamPoints
            }
        })

        return reply.status(201).send()
    })
    
}