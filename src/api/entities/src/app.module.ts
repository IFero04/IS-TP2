import { Module } from '@nestjs/common';

import { TeamsModule } from './teams/teams.module';
import { CollegesModule } from './colleges/colleges.module';
import { CountriesModule } from './countries/countries.module';
import { EntriesModule } from './entries/entries.module';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [TeamsModule, CollegesModule, CountriesModule, EntriesModule, PlayersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
