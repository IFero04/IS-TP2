import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateCountryDto } from './dto/createCountry.dto'; 
import { UpdateCountryDto } from './dto/updateCountry.dto';


@Injectable()
export class CountriesService {
    private prisma = new PrismaClient();

    // Create
    async createCountry(country: CreateCountryDto) {
        return this.prisma.countries.create({
            data: country,
        });
    }

    // Read
    async readAllCountries() {
        return this.prisma.countries.findMany({
            orderBy: {
                id: 'asc'
            }
        });
    }

    async readCountryById(id: number) {
        return this.prisma.countries.findUnique({
            where: { id:Number(id) },
        });
    }
    
    async readCountryByName(name: string) {
        return this.prisma.countries.findUnique({
            where: { name:String(name) },
        });
    }

    async readPlayersByCountry(id: number) {
        return this.prisma.countries.findUnique({
            where: { id:Number(id) },
            include: {
                players: true,
            }
        });
    }

    // Update
    async updateCountry(id: number, country: UpdateCountryDto) {
        return this.prisma.countries.update({
            where: { id:Number(id) },
            data: {
                ...country,
                id: undefined,
            }
        });
    }

    // Delete
    async deleteCountry(id: number) {
        return this.prisma.countries.delete({
            where: { id:Number(id) },
        });
    }
}

