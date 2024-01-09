import { Controller, Get, Post, Delete, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/createCountry.dto'; 
import { UpdateCountryDto } from './dto/updateCountry.dto';
import { get } from 'http';



@Controller('api/countries')
export class CountriesController {
    constructor(private readonly countriesService: CountriesService) {}

    // Create
    @Post()
    async createCountry(@Req() request: Request, @Res() response: Response): Promise<any> {
        try{
            const country: CreateCountryDto = {
                name: request.body.name,
            };

            const result = await this.countriesService.createCountry(country);

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
            const result = await this.countriesService.readAllCountries();
            
            if (result == null) {
                return response.status(404).json({
                    status: "NOT FOUND!",
                    message: 'Countries not FOUND!',
                    result: null,
                });
            }

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

            const result = await this.countriesService.readCountryById(id);
            
            if (result == null) {
                return response.status(404).json({
                    status: "NOT FOUND!",
                    message: 'Country not FOUND!',
                    result: null,
                });
            }

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

    @Get('/name/:name')
    async readCountryByName(@Req() request: Request, @Res() response: Response): Promise<any> {
        try{
            const name = String(request.params.name);

            const result = await this.countriesService.readCountryByName(name);

            if (result == null) {
                return response.status(404).json({
                    status: "NOT FOUND!",
                    message: 'Country not FOUND!',
                    result: null,
                });
            }

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

    @Get(':id/players')
    async readPlayersByCountry(@Req() request: Request, @Res() response: Response): Promise<any> {
        try{
            const id = Number(request.params.id);

            const result = await this.countriesService.readPlayersByCountry(id);

            return response.status(200).json({
                status: "OK!",
                message: 'Players retrieved successfully!',
                result: result,
            });
        }catch(err){
            return response.status(500).json({
                status: "ERROR!",
                message: 'Players not retrieved!',
                result: err,
            });
        }
    }

    // Update
    @Put(':id')
    async updateCountry(@Req() request: Request, @Res() response: Response): Promise<any> {
        try{
            const id = Number(request.params.id);
            const country: UpdateCountryDto = {
                name: request.body.name,
            };

            const result = await this.countriesService.updateCountry(id, country);

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

            const result = await this.countriesService.deleteCountry(id);

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
