import express, { Request, Response } from 'express'
import { route } from './routes';

const app = express();


app.use('/api/v1', route)
