import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateEntryDto } from './dto/createEntry.dto';
import { UpdateEntryDto } from './dto/updateEntry.dto';


@Injectable()
export class EntriesService {
    private prisma = new PrismaClient();

    // Create
    async createEntry(entry: CreateEntryDto) {
        return this.prisma.entries.create({
            data: entry,  
        });
    }

    // Read
    async readAllEntries() {
        return this.prisma.entries.findMany({
            orderBy: {
                id: 'asc'
            }
        });
    }

    async readEntryById(id: number) {
        return this.prisma.entries.findUnique({
            where: { id: Number(id) },
        });
    }

    async readEntryUnique(season: string, player_ref: number, team_ref: number) {
        return this.prisma.entries.findFirst({
            where: { 
                season: String(season),
                player_ref: Number(player_ref),
                team_ref: Number(team_ref)
            },
        });
    }
    
    
    // Update
    async updateEntry(id: number, entry: UpdateEntryDto) {
        return this.prisma.entries.update({
            where: { id: Number(id) },
            data: {
                ...entry,
                id: undefined,
            }
        });
    }

    // Delete
    async deleteEntry(id: number) {
        return this.prisma.entries.delete({
            where: { id: Number(id) },
        });
    }
}
