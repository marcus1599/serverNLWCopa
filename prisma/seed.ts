
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data:{
            name:'Marcola',
            email:'vdfs@gmail.com',
            avatarUrl:'https://github.com/marcus159.png'
        }
    })
    const pool = await prisma.pool.create({
        data:{
            title:'JOGAÇO',
            code:'fghbn',
            ownerId: user.id,
            participants:{
                create:{
                    userId:user.id
                }
            }
        }
    })
   await prisma.game.create({
        data:{
            date:'2022-11-02T12:00:00.201Z',
            firstTeamCountryCode:'DE',
            secondTeamCountryCode:'BR'
        }
    })
    await prisma.game.create({
        data:{
            date:'2022-11-02T12:00:01.201Z',
            firstTeamCountryCode:'AR',
            secondTeamCountryCode:'BR',
            guesses:{
                create:{
                    firstTeamPoinst: 1,
                    secontTeamPoints:9,

                    participant:{
                        connect:{
                            userId_poolId:{
                                userId :user.id,
                                poolId:pool.id
                        }
                        
                    }
                }
            }
        }
    }})
}
main()