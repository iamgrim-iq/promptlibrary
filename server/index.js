import express from 'express';
import cors from 'cors';
import fs from 'fs-extra';
import path from 'path';

import categoryRoutes from './routes/categories.js';
import promptRoutes from './routes/prompts.js';

const app = express();
const port = 3001;
const promptsDir = 'C:\\databases\\prompts';

fs.ensureDirSync(promptsDir);

app.use(cors());
app.use(express.json());

app.use('/api/categories', categoryRoutes);
app.use('/api/categories/:categoryName/prompts', promptRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});