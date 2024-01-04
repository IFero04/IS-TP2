import { Controller, Get } from '@nestjs/common';
import { EntriesService } from './entries.service';

@Controller('api/entries')
export class EntriesController {
    constructor(private readonly entriesService: EntriesService) {}

    @Get()
    async findAll() {
        return this.entriesService.findAll();
    }
}
