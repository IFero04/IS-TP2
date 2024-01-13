import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateCollegeDto } from './dto/createCollege.dto';
import { UpdateCollegeDto } from './dto/updateCollege.dto';


@Injectable()
export class CollegesService {
    private prisma = new PrismaClient();

    // Create
    async createCollege(college: CreateCollegeDto) {
        return this.prisma.colleges.create({
            data: college,
        });
    }

    // Read
    async readAllColleges() {
        return this.prisma.colleges.findMany({
            orderBy: {
                id: 'asc'
            }
        });
    }

    async readCollegeById(id: number) {
        return this.prisma.colleges.findUnique({
            where: { id:Number(id) },
        });
    }

    async readCollegeByName(name: string) {
        return this.prisma.colleges.findUnique({
            where: { name:String(name) },
        });
    }

    // Update
    async updateCollege(id: number, college: UpdateCollegeDto) {
        return this.prisma.colleges.update({
            where: { id:Number(id) },
            data: {
                ...college,
                id: undefined,
            }
        });
    }

    async deleteCollege(id: number) {
        return this.prisma.colleges.delete({
            where: { id:Number(id) },
        });
    }
}
