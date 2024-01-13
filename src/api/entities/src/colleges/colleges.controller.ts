import { Controller, Get, Post, Delete, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { CollegesService } from './colleges.service';
import { CreateCollegeDto } from './dto/createCollege.dto';
import { UpdateCollegeDto } from './dto/updateCollege.dto';



@Controller('api/colleges')
export class CollegesController {
    constructor(private readonly collegesService: CollegesService) {}

    // Create
    @Post()
    async createCollege(@Req() request: Request, @Res() response: Response): Promise<any> {
        try{
            const college: CreateCollegeDto = {
                name: request.body.name,
            };

            const result = await this.collegesService.createCollege(college);

            return response.status(200).json({
                status: "OK!",
                message: 'College created successfully!',
                result: result,
            });
        }catch(err){
            return response.status(500).json({
                status: "ERROR!",
                message: 'College not created!',
                result: err,
            });
        }
    }

    // Read
    @Get()
    async readAllColleges(@Res() response: Response): Promise<any> {
        try{
            const result = await this.collegesService.readAllColleges();

            if (result == null) {
                return response.status(404).json({
                    status: "NOT FOUND!",
                    message: 'Colleges not FOUND!',
                    result: null,
                });
            }
            
            return response.status(200).json({
                status: "OK!",
                message: 'Colleges retrieved successfully!',
                result: result,
            });
        }catch(err){
            return response.status(500).json({
                status: "ERROR!",
                message: 'Colleges not retrieved!',
                result: err,
            });
        }
    }

    @Get(':id')
    async readCollegeById(@Req() request: Request, @Res() response: Response): Promise<any> {
        try{
            const id = Number(request.params.id);
            const result = await this.collegesService.readCollegeById(id);

            if (result == null) {
                return response.status(404).json({
                    status: "NOT FOUND!",
                    message: 'College not FOUND!',
                    result: null,
                });
            }

            return response.status(200).json({
                status: "OK!",
                message: 'College retrieved successfully!',
                result: result,
            });
        }catch(err){
            return response.status(500).json({
                status: "ERROR!",
                message: 'College not retrieved!',
                result: err,
            });
        }
    }

    @Get('/name/:name')
    async readCollegeByName(@Req() request: Request, @Res() response: Response): Promise<any> {
        try{
            const name = String(request.params.name);

            const result = await this.collegesService.readCollegeByName(name);

            if (result == null) {
                return response.status(404).json({
                    status: "NOT FOUND!",
                    message: 'College not FOUND!',
                    result: null,
                });
            }

            return response.status(200).json({
                status: "OK!",
                message: 'College retrieved successfully!',
                result: result,
            });
        }catch(err){
            return response.status(500).json({
                status: "ERROR!",
                message: 'College not retrieved!',
                result: err,
            });
        }
    }

    // Update
    @Put(':id')
    async updateCollege(@Req() request: Request, @Res() response: Response): Promise<any> {
        try{
            const id = Number(request.params.id);
            const college: UpdateCollegeDto = {
                name: request.body.name,
            };

            const result = await this.collegesService.updateCollege(id, college);

            return response.status(200).json({
                status: "OK!",
                message: 'College updated successfully!',
                result: result,
            });
        }catch(err){
            return response.status(500).json({
                status: "ERROR!",
                message: 'College not updated!',
                result: err,
            });
        }
    }

    // Delete
    @Delete(':id')
    async deleteCollege(@Req() request: Request, @Res() response: Response): Promise<any> {
        try{
            const id = Number(request.params.id);

            const result = await this.collegesService.deleteCollege(id);

            return response.status(200).json({
                status: "OK!",
                message: 'College deleted successfully!',
                result: result,
            });
        }catch(err){
            return response.status(500).json({
                status: "ERROR!",
                message: 'College not deleted!',
                result: err,
            });
        }
    }
}
