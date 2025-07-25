import express from 'express';
import fs from 'fs-extra';
import path from 'path';

const router = express.Router({ mergeParams: true });
const promptsDir = 'C:\\databases\\prompts';

router.get('/', async (req, res) => {
    const { categoryName } = req.params;
    const categoryPath = path.join(promptsDir, categoryName);
    try {
        if (!(await fs.pathExists(categoryPath))) {
            return res.json([]);
        }
        const promptFiles = await fs.readdir(categoryPath);
        const promptContents = await Promise.all(
            promptFiles.map(async (promptFile) => {
                const filePath = path.join(categoryPath, promptFile);
                const fileContent = await fs.readFile(filePath, 'utf-8');
                let data;
                try { data = JSON.parse(fileContent); } 
                catch (e) { data = { content: fileContent, tag: 'ПРОМПТ' }; }
                return { name: path.parse(promptFile).name, content: data.content, tag: data.tag || 'ПРОМПТ' };
            })
        );
        res.json(promptContents);
    } catch (error) {
        res.status(500).json({ error: 'Не удалось прочитать промпты' });
    }
});

router.post('/', async (req, res) => {
    const { categoryName } = req.params;
    const { promptName, content, tag = 'ПРОМПТ' } = req.body;
    if (!promptName || !promptName.trim() || content === undefined) {
        return res.status(400).json({ error: 'Название и содержимое промпта обязательны' });
    }
    const filePath = path.join(promptsDir, categoryName, `${promptName.trim()}.txt`);
    try {
        if (await fs.pathExists(filePath)) {
            return res.status(409).json({ error: 'Промпт с таким названием уже существует в этой категории.' });
        }
        const dataToSave = JSON.stringify({ content, tag });
        await fs.writeFile(filePath, dataToSave, 'utf-8');
        res.status(201).json({ message: 'Промпт успешно создан' });
    } catch (error) {
        res.status(500).json({ error: 'Не удалось создать промпт' });
    }
});

router.put('/:promptName', async (req, res) => {
    const { categoryName, promptName } = req.params;
    const { content, tag } = req.body;
    if (content === undefined || tag === undefined) {
        return res.status(400).json({ error: 'Содержимое и тег обязательны' });
    }
    const filePath = path.join(promptsDir, categoryName, `${promptName}.txt`);
    try {
        const dataToSave = JSON.stringify({ content, tag });
        await fs.writeFile(filePath, dataToSave, 'utf-8');
        res.json({ message: 'Промпт успешно обновлен' });
    } catch (error) {
        res.status(500).json({ error: 'Не удалось обновить промпт' });
    }
});

router.delete('/:promptName', async (req, res) => {
    const { categoryName, promptName } = req.params;
    const filePath = path.join(promptsDir, categoryName, `${promptName}.txt`);
    try {
        await fs.unlink(filePath);
        res.json({ message: 'Промпт успешно удален' });
    } catch (error) {
        res.status(500).json({ error: 'Не удалось удалить промпт' });
    }
});

export default router;
