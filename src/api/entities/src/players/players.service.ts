import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreatePlayerDto } from './dto/createPlayer.dto';
import { UpdatePlayerDto } from './dto/updatePlayer.dto';


@Injectable()
export class PlayersService {
    private prisma = new PrismaClient();

    // Create
    async createPlayer(player: CreatePlayerDto) {
        return this.prisma.players.create({
            data: player,  
        });
    }
    
    // Read
    async readAllPlayers() {
        return this.prisma.players.findMany({
            orderBy: {
                id: 'asc'
            }
        });
    }

    async readPlayerById(id: number) {
        return this.prisma.players.findUnique({
            where: { id: Number(id) },
        });
    }

    async readPlayerByName(name: string) {
        return this.prisma.players.findUnique({
            where: { name:String(name) },
        });
    }

    // Update
    async updatePlayer(id: number, player: UpdatePlayerDto) {
        return this.prisma.players.update({
            where: { id: Number(id) },
            data: {
                ...player,
                id: undefined,
            }
        });
    }

    // Delete
    async deletePlayer(id: number) {
        return this.prisma.players.delete({
            where: { id: Number(id) },
        });
    }
}
