import { Controller, Get } from '@nestjs/common';
import { NunjucksService } from 'nest-nunjucks';

@Controller()
export class AppController {
  constructor(private template: NunjucksService) {}

  @Get()
  home(): Promise<string> {
    const names = ['Ernest', 'Johnny Mensah'];
    return this.template.render('home.njk', {names, title:'3 Students'});
  }

  @Get('get-started')
  intro(){
    return ['jone', 'john'];
  }
}
