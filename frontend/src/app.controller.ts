import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { version } from 'os';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getInfo() {
    return {
      app: 'NestJS Real-Time Chat',
      version: '1.0.0',
      status: 'running',
    }
  }
}
