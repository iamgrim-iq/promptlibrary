import express from 'express';
import fs from 'fs-extra';
import path from 'path';

const router = express.Router();
const promptsDir = 'C:\\databases\\prompts';

router.get('/', async (req, res) => {
    try {
        const dirents = await fs.readdir(promptsDir, { withFileTypes: true });
        const categoryNames = dirents
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
        res.json(categoryNames);
    } catch (error) {
        res.status(500).json({ error: 'Не удалось прочитать категории' });
    }
});

router.post('/', async (req, res) => {
    const { categoryName } = req.body;
    if (!categoryName || !categoryName.trim()) {
        return res.status(400).json({ error: 'Требуется название категории' });
    }
    const categoryPath = path.join(promptsDir, categoryName.trim());
    try {
        if (await fs.pathExists(categoryPath)) {
            return res.status(409).json({ error: 'Категория с таким названием уже существует' });
        }
        await fs.ensureDir(categoryPath);
        res.status(201).json({ message: 'Категория успешно создана' });
    } catch (error) {
        res.status(500).json({ error: 'Не удалось создать категорию' });
    }
});

router.put('/:categoryName', async (req, res) => {
    const { categoryName } = req.params;
    const { newCategoryName } = req.body;

    if (!newCategoryName || !newCategoryName.trim()) {
        return res.status(400).json({ error: 'Требуется новое название категории' });
    }

    const oldPath = path.join(promptsDir, categoryName);
    const newPath = path.join(promptsDir, newCategoryName.trim());

    try {
        if (oldPath.toLowerCase() === newPath.toLowerCase()) {
            return res.json({ message: 'Названия совпадают, переименование не требуется' });
        }
        if (await fs.pathExists(newPath)) {
            return res.status(409).json({ error: 'Категория с таким новым названием уже существует.' });
        }
        if (!(await fs.pathExists(oldPath))) {
            return res.status(404).json({ error: 'Категория для переименования не найдена.' });
        }

        await fs.rename(oldPath, newPath);
        res.json({ message: 'Категория успешно переименована' });
    } catch (error) {
        res.status(500).json({ error: 'Не удалось переименовать категорию' });
    }
});

router.delete('/:categoryName', async (req, res) => {
    const { categoryName } = req.params;
    const categoryPath = path.join(promptsDir, categoryName);

    try {
        if (!(await fs.pathExists(categoryPath))) {
             return res.status(404).json({ error: 'Категория не найдена' });
        }
        await fs.remove(categoryPath);
        res.json({ message: 'Категория успешно удалена' });
    } catch (error) {
        res.status(500).json({ error: 'Не удалось удалить категорию' });
    }
});

export default router;
