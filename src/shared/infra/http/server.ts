import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';

import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
}));

app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder))
app.use(routes);

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err.message);

  return response.status(500).json({
    status: 'error',
    message: 'internal server error',
  })
});

app.listen(3333, () => {
    console.log('Server launched on port 3333');
});