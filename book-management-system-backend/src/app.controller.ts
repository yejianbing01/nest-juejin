import { BadRequestException, Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { storage } from './my-file-storage';
import * as fs from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('file')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'public/uploads',
      storage: storage,
      limits: { fieldSize: 1024 * 1024 * 5 },
      fileFilter: (req, file, cb) => {
        const extname = path.extname(file.originalname);
        if (['.png', '.jpg', '.jpeg'].includes(extname)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('文件格式不正确'), false);
        }
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return file.path;
  }

  @Post('chunkFile')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'public/uploads',
    }),
  )
  chunkFile(@UploadedFile() file: Express.Multer.File, @Body('name') name: string) {
    console.log(file);
    console.log(name);
    const fileName = name.match(/(.+)\-\d+$/)[1];
    const chunkDir = 'public/uploads/chunks_' + fileName;
    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir);
    }

    fs.cpSync(file.path, chunkDir + '/' + name);
    fs.rmSync(file.path);
  }

  @Get('mergeFile')
  mergeFile(@Query('name') name: string) {
    const chunkDir = 'public/uploads/chunks_' + name;
    const files = fs.readdirSync(chunkDir);
    files.sort((a, b) => {
      return Number(a.split('-')[1]) - Number(b.split('-')[1]);
    });

    let startPos = 0;
    const finialFilePath = 'public/uploads/' + name;
    files.forEach((file) => {
      const filePath = chunkDir + '/' + file;
      fs.createReadStream(filePath)
        .pipe(fs.createWriteStream(finialFilePath, { start: startPos }))
        .on('finish', () => {
          fs.rmdir(chunkDir, { recursive: true }, () => {});
        });

      startPos += fs.statSync(filePath).size;
    });

    return finialFilePath;
  }
}
