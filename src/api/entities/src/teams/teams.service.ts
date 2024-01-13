import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateTeamDto } from './dto/createTeam.dto';
import { UpdateTeamDto } from './dto/updateTeam.dto';


@Injectable()
export class TeamsService {
    private prisma = new PrismaClient();

    // Create
    async createTeam(team: CreateTeamDto) {
        return this.prisma.teams.create({
            data: team,
        });
    }

    // Read
    async readAllTeams() {
        return this.prisma.teams.findMany({
            orderBy: {
                id: 'asc'
            }
        });
    }

    async readTeamById(id: number) {
        return this.prisma.teams.findUnique({
            where: { id:Number(id) },
        });
    }

    async readTeamByAbbreviation(abbreviation: string) {
        return this.prisma.teams.findUnique({
            where: { abbreviation:String(abbreviation) },
        });
    }

    // Update
    async updateTeam(id: number, team: UpdateTeamDto) {
        return this.prisma.teams.update({
            where: { id:Number(id) },
            data: {
                ...team,
                id: undefined,
            }
        });
    }

    // Delete
    async deleteTeam(id: number) {
        return this.prisma.teams.delete({
            where: { id:Number(id) },
        });
    }
}
