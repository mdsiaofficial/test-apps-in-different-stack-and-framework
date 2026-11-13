import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('api/stats')
export class StatsController {
  constructor(private service: StatsService) {}

  @Get('summary')
  summary() {
    return this.service.summary();
  }
}