import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('NestJS Core Guide')
  .setDescription('NestJS Core Guide Description')
  .setVersion('1.0')
  .addBearerAuth({
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    name:'JWT accessToken',
    description:'Enter JWT accessToken',
    in:'header',
  },
'accessToken')
  .addBearerAuth({
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    name:'JWT refreshToken',
    description:'Enter JWT refreshToken',
    in:'header',
  },
  'refreshToken')
  .build();

  const documentFactory = ()=> SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api-docs',app,documentFactory);


  //localhost:5000/api-docs

  await app.listen(5000);
}
bootstrap();
