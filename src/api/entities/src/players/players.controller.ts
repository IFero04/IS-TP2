import { Controller, Get, Post, Delete, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/createPlayer.dto';
import { UpdatePlayerDto } from './dto/updatePlayer.dto';


@Controller('api/players')
export class PlayersController {
    constructor(private readonly playersService: PlayersService) {}

    // Create
    @Post()
    async createPlayer(@Req() request: Request, @Res() response: Response): Promise<any> {
        try {
            const player: CreatePlayerDto = {
                name: request.body.name,
                age: request.body.age,
                height: request.body.height,
                weight: request.body.weight,
                draftyear: request.body.draftyear,
                draftround: request.body.draftround,
                draftnumber: request.body.draftnumber,
                college_ref: request.body.college_ref,
                country_ref: request.body.country_ref,
            };
                
            const result = await this.playersService.createPlayer(player);

            return response.status(200).json({
                status: "OK!",
                message: 'Player created successfully!',
                result: result,
            });
        }catch(err){
            return response.status(500).json({
                status: "ERROR!",
                message: 'Player not created!',
                result: err,
            });
        }
    }


    // Read
    @Get()
    async readAllPlayers(@Req() request: Request, @Res() response: Response): Promise<any> {
        try {
            const result = await this.playersService.readAllPlayers();

            if (result == null) {
                return response.status(404).json({
                    status: "NOT FOUND!",
                    message: 'Players not FOUND!',
                    result: null,
                });
            }

            return response.status(200).json({
                status: "OK!",
                message: 'Players read successfully!',
                result: result,
            });
        }catch(err){
            return response.status(500).json({
                status: "ERROR!",
                message: 'Players not read!',
                result: err,
            });
        }
    }

    @Get(':id')
    async readPlayerById(@Req() request: Request, @Res() response: Response): Promise<any> {
        try {
            const id = Number(request.params.id);

            const result = await this.playersService.readPlayerById(id);

            if (result == null) {
                return response.status(404).json({
                    status: "NOT FOUND!",
                    message: 'Player not FOUND!',
                    result: null,
                });
            }

            return response.status(200).json({
                status: "OK!",
                message: 'Player read successfully!',
                result: result,
            });
        }catch(err){
            return response.status(500).json({
                status: "ERROR!",
                message: 'Player not read!',
                result: err,
            });
        }
    }

    @Get('name/:name')
    async readPlayerByName(@Req() request: Request, @Res() response: Response): Promise<any> {
        try {
            const name = request.params.name;

            const result = await this.playersService.readPlayerByName(name);

            if (result == null) {
                return response.status(404).json({
                    status: "NOT FOUND!",
                    message: 'Player not FOUND!',
                    result: null,
                });
            }

            return response.status(200).json({
                status: "OK!",
                message: 'Player read successfully!',
                result: result,
            });
        }catch(err){
            return response.status(500).json({
                status: "ERROR!",
                message: 'Player not read!',
                result: err,
            });
        }
    }

    // Update
    @Put(':id')
    async updatePlayerById(@Req() request: Request, @Res() response: Response): Promise<any> {
        try {
            const id = Number(request.params.id);

            const player: UpdatePlayerDto = {
                name: request.body.name,
                age: request.body.age,
                height: request.body.height,
                weight: request.body.weight,
                draftyear: request.body.draftyear,
                draftround: request.body.draftround,
                draftnumber: request.body.draftnumber,
                college_ref: request.body.college_ref,
                country_ref: request.body.country_ref,
            };

            const result = await this.playersService.updatePlayer(id, player);

            return response.status(200).json({
                status: "OK!",
                message: 'Player updated successfully!',
                result: result,
            });
        }catch(err){
            return response.status(500).json({
                status: "ERROR!",
                message: 'Player not updated!',
                result: err,
            });
        }
    }

    // Delete
    @Delete(':id')
    async deletePlayerById(@Req() request: Request, @Res() response: Response): Promise<any> {
        try {
            const id = Number(request.params.id);

            const result = await this.playersService.deletePlayer(id);

            return response.status(200).json({
                status: "OK!",
                message: 'Player deleted successfully!',
                result: result,
            });
        }catch(err){
            return response.status(500).json({
                status: "ERROR!",
                message: 'Player not deleted!',
                result: err,
            });
        }
    }
}
