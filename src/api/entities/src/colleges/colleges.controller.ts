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
    async createCountry(@Req() request: Request, @Res() response: Response): Promise<any> {
        try{
            const college: CreateCollegeDto = {
                name: request.body.name,
            };

            const result = await this.collegesService.createCollege(college);

            return response.status(200).json({
                status: "OK!",
                message: 'Country created successfully!',
                result: result,
            });
        }catch(err){
            return response.status(500).json({
                status: "ERROR!",
                message: 'Country not created!',
                result: err,
            });
        }
    }

    // Read
    @Get()
    async readAllCountries(@Res() response: Response): Promise<any> {
        try{
            const result = await this.collegesService.readAllColleges();
            
            return response.status(200).json({
                status: "OK!",
                message: 'Countries retrieved successfully!',
                result: result,
            });
        }catch(err){
            return response.status(500).json({
                status: "ERROR!",
                message: 'Countries not retrieved!',
                result: err,
            });
        }
    }

    @Get(':id')
    async readCountryById(@Req() request: Request, @Res() response: Response): Promise<any> {
        try{
            const id = Number(request.params.id);
            const result = await this.collegesService.readCollegeById(id);
            
            return response.status(200).json({
                status: "OK!",
                message: 'Country retrieved successfully!',
                result: result,
            });
        }catch(err){
            return response.status(500).json({
                status: "ERROR!",
                message: 'Country not retrieved!',
                result: err,
            });
        }
    }

    // Update
    @Put(':id')
    async updateCountry(@Req() request: Request, @Res() response: Response): Promise<any> {
        try{
            const id = Number(request.params.id);
            const college: UpdateCollegeDto = {
                name: request.body.name,
            };

            const result = await this.collegesService.updateCollege(id, college);

            return response.status(200).json({
                status: "OK!",
                message: 'Country updated successfully!',
                result: result,
            });
        }catch(err){
            return response.status(500).json({
                status: "ERROR!",
                message: 'Country not updated!',
                result: err,
            });
        }
    }

    // Delete
    @Delete(':id')
    async deleteCountry(@Req() request: Request, @Res() response: Response): Promise<any> {
        try{
            const id = Number(request.params.id);

            const result = await this.collegesService.deleteCollege(id);

            return response.status(200).json({
                status: "OK!",
                message: 'Country deleted successfully!',
                result: result,
            });
        }catch(err){
            return response.status(500).json({
                status: "ERROR!",
                message: 'Country not deleted!',
                result: err,
            });
        }
    }
}
