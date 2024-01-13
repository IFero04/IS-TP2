import { Controller, Get, Post, Delete, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/createTeam.dto';
import { UpdateTeamDto } from './dto/updateTeam.dto';

@Controller('api/teams')
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) {}


    // Create
    @Post()
    async createTeam(@Req() request: Request, @Res() response: Response): Promise<any> {
        try{
            const team: CreateTeamDto = {
                abbreviation: request.body.abbreviation,
            };

            const result = await this.teamsService.createTeam(team);

            return response.status(200).json({
                status: "OK!",
                message: 'Team created successfully!',
                result: result,
            });
        }catch(err){
            return response.status(500).json({
                status: "ERROR!",
                message: 'Team not created!',
                result: err,
            });
        }
    }

    // Read
    @Get()
    async readAllTeams(@Res() response: Response): Promise<any> {
        try{
            const result = await this.teamsService.readAllTeams();
            
            if (result == null) {
                return response.status(404).json({
                    status: "NOT FOUND!",
                    message: 'Teams not FOUND!',
                    result: null,
                });
            }

            return response.status(200).json({
                status: "OK!",
                message: 'Teams retrieved successfully!',
                result: result,
            });
        }catch(err){
            return response.status(500).json({
                status: "ERROR!",
                message: 'Teams not retrieved!',
                result: err,
            });
        }
    }

    @Get(':id')
    async readTeamById(@Req() request: Request, @Res() response: Response): Promise<any> {
        try{
            const id = Number(request.params.id);

            const result = await this.teamsService.readTeamById(id);

            if (result == null) {
                return response.status(404).json({
                    status: "NOT FOUND!",
                    message: 'Team not FOUND!',
                    result: null,
                });
            }

            return response.status(200).json({
                status: "OK!",
                message: 'Team retrieved successfully!',
                result: result,
            });
        }catch(err){
            return response.status(500).json({
                status: "ERROR!",
                message: 'Team not retrieved!',
                result: err,
            });
        }
    }

    @Get('abbreviation/:abbreviation')
    async readTeamByAbbreviation(@Req() request: Request, @Res() response: Response): Promise<any> {
        try{
            const abbreviation = String(request.params.abbreviation);

            const result = await this.teamsService.readTeamByAbbreviation(abbreviation);

            if (result == null) {
                return response.status(404).json({
                    status: "NOT FOUND!",
                    message: 'Team not FOUND!',
                    result: null,
                });
            }

            return response.status(200).json({
                status: "OK!",
                message: 'Team retrieved successfully!',
                result: result,
            });
        }catch(err){
            return response.status(500).json({
                status: "ERROR!",
                message: 'Team not retrieved!',
                result: err,
            });
        }
    }

    // Update
    @Put(':id')
    async updateTeamById(@Req() request: Request, @Res() response: Response): Promise<any> {
        try{
            const id = Number(request.params.id);
            const team: UpdateTeamDto = {
                abbreviation: request.body.abbreviation,
            };

            const result = await this.teamsService.updateTeam(id, team);

            return response.status(200).json({
                status: "OK!",
                message: 'Team updated successfully!',
                result: result,
            });
        }catch(err){
            return response.status(500).json({
                status: "ERROR!",
                message: 'Team not updated!',
                result: err,
            });
        }
    }

    // Delete
    @Delete(':id')
    async deleteTeamById(@Req() request: Request, @Res() response: Response): Promise<any> {
        try{
            const id = Number(request.params.id);

            const result = await this.teamsService.deleteTeam(id);

            return response.status(200).json({
                status: "OK!",
                message: 'Team deleted successfully!',
                result: result,
            });
        }catch(err){
            return response.status(500).json({
                status: "ERROR!",
                message: 'Team not deleted!',
                result: err,
            });
        }
    }
}
