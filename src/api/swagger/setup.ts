import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export const setup = (app) =>{
    const options = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document); 
}