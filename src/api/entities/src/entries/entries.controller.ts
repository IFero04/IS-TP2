import { Controller, Get, Post, Delete, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { EntriesService } from './entries.service';
import { CreateEntryDto } from './dto/createEntry.dto';
import { UpdateEntryDto } from './dto/updateEntry.dto';


@Controller('api/entries')
export class EntriesController {
    constructor(private readonly entriesService: EntriesService) {}

    // Create
    @Post()
    async createEntry(@Req() request: Request, @Res() response: Response): Promise<any> {
        try {
            const entry: CreateEntryDto = {
                season: request.body.season,
                gp: request.body.gp,
                pts: request.body.pts,
                reb: request.body.reb,
                ast: request.body.ast,
                net_rating: request.body.net_rating,
                oreb_pct: request.body.oreb_pct,
                dreb_pct: request.body.dreb_pct,
                usg_pct: request.body.usg_pct,
                ts_pct: request.body.ts_pct,
                ast_pct: request.body.ast_pct,
                player_ref: request.body.player_ref,
                team_ref: request.body.team_ref,
            };

            const result = await this.entriesService.createEntry(entry);

            return response.status(200).json({
                status: "OK!",
                message: 'Entry created successfully!',
                result: result,
            });
        }catch(err){
            return response.status(500).json({
                status: "ERROR!",
                message: 'Entry not created!',
                result: err,
            });
        }
    }

    // Read
    @Get()
    async readAllEntries(@Req() request: Request, @Res() response: Response): Promise<any> {
        try {
            const result = await this.entriesService.readAllEntries();

            if (result == null) {
                return response.status(404).json({
                    status: "NOT FOUND!",
                    message: 'Entries not FOUND!',
                    result: null,
                });
            }

            return response.status(200).json({
                status: "OK!",
                message: 'Entries retrieved successfully!',
                result: result,
            });
        }catch(err){
            return response.status(500).json({
                status: "ERROR!",
                message: 'Entries not retrieved!',
                result: err,
            });
        }
    }

    @Get(':id')
    async readEntryById(@Req() request: Request, @Res() response: Response): Promise<any> {
        try {
            const id = Number(request.params.id);

            const result = await this.entriesService.readEntryById(id);

            if (result == null) {
                return response.status(404).json({
                    status: "NOT FOUND!",
                    message: 'Entry not FOUND!',
                    result: null,
                });
            }

            return response.status(200).json({
                status: "OK!",
                message: 'Entry retrieved successfully!',
                result: result,
            });
        }catch(err){
            return response.status(500).json({
                status: "ERROR!",
                message: 'Entry not retrieved!',
                result: err,
            });
        }
    }

    @Get('unique/:season/:player_ref/:team_ref')
    async readEntryUnique(@Req() request: Request, @Res() response: Response): Promise<any> {
        try {
            const season = String(request.params.season);
            const player_ref = Number(request.params.player_ref);
            const team_ref = Number(request.params.team_ref);

            const result = await this.entriesService.readEntryUnique(season, player_ref, team_ref);

            if (result == null) {
                return response.status(404).json({
                    status: "NOT FOUND!",
                    message: 'Entry not FOUND!',
                    result: null,
                });
            }

            return response.status(200).json({
                status: "OK!",
                message: 'Entry retrieved successfully!',
                result: result,
            });
        }catch(err){
            return response.status(500).json({
                status: "ERROR!",
                message: 'Entry not retrieved!',
                result: err,
            });
        }
    }


    // Update
    @Put(':id')
    async updateEntry(@Req() request: Request, @Res() response: Response): Promise<any> {
        try {
            const id = Number(request.params.id);

            const entry: UpdateEntryDto = {
                season: request.body.season,
                gp: request.body.gp,
                pts: request.body.pts,
                reb: request.body.reb,
                ast: request.body.ast,
                net_rating: request.body.net_rating,
                oreb_pct: request.body.oreb_pct,
                dreb_pct: request.body.dreb_pct,
                usg_pct: request.body.usg_pct,
                ts_pct: request.body.ts_pct,
                ast_pct: request.body.ast_pct,
                player_ref: request.body.player_ref,
                team_ref: request.body.team_ref,
            };

            const result = await this.entriesService.updateEntry(id, entry);

            return response.status(200).json({
                status: "OK!",
                message: 'Entry updated successfully!',
                result: result,
            });
        }catch(err){
            return response.status(500).json({
                status: "ERROR!",
                message: 'Entry not updated!',
                result: err,
            });
        }
    }

    // Delete
    @Delete(':id')
    async deleteEntry(@Req() request: Request, @Res() response: Response): Promise<any> {
        try {
            const id = Number(request.params.id);

            const result = await this.entriesService.deleteEntry(id);

            return response.status(200).json({
                status: "OK!",
                message: 'Entry deleted successfully!',
                result: result,
            });
        }catch(err){
            return response.status(500).json({
                status: "ERROR!",
                message: 'Entry not deleted!',
                result: err,
            });
        }
    }
}
