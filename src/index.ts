import express from 'express'
import { route } from './routes';
import { connectDB } from './db';

const app = express();
const port = 3000;
app.use(express.json())
connectDB();
app.use('/api/v1', route)
app.listen(port, ()=>{
    console.log(`Server is running on Port : ${port}`)
})
