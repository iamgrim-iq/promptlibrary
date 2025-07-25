"use client";

import React, { useState, useEffect, useCallback } from 'react';
import * as api from '@/lib/api';
import { Prompt } from '@/lib/api';
import Header from './Header';
import CategoryTabs from './CategoryTabs';
import PromptForm from './PromptForm';
import PromptList from './PromptList';

type PromptForCreate = Omit<Prompt, 'name'> & { promptName: string };

const PromptLibrary: React.FC = () => {
    const [categories, setCategories] = useState<string[]>([]);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [prompts, setPrompts] = useState<api.Prompt[]>([]);
    const [editingPrompt, setEditingPrompt] = useState<api.Prompt | null>(null);

    const loadCategories = useCallback(async (selectCategory: string | null = null) => {
        try {
            const data = await api.fetchCategories();
            setCategories(data);

            if (selectCategory && data.includes(selectCategory)) {
                setActiveCategory(selectCategory);
            } else if (data.length > 0 && !data.includes(activeCategory || '')) {
                setActiveCategory(data[0]);
            } else if (data.length === 0) {
                setActiveCategory(null);
            }
        } catch (error) {
            console.error("Не удалось загрузить категории:", error);
            alert(`Не удалось загрузить категории. Сервер запущен?`);
        }
    }, [activeCategory]);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadPrompts = useCallback(async (category: string) => {
        try {
            const data = await api.fetchPrompts(category);
            setPrompts(data);
        } catch (error) {
            setPrompts([]);
            console.error(`Не удалось загрузить промпты для ${category}:`, error);
        }
    }, []);

    useEffect(() => {
        if (activeCategory) {
            loadPrompts(activeCategory);
            setEditingPrompt(null);
        } else {
            setPrompts([]);
        }
    }, [activeCategory, loadPrompts]);
    
    const handleCreateCategory = async (categoryName: string) => {
        try {
            await api.createCategory(categoryName);
            await loadCategories(categoryName);
        } catch (error) {
            console.error("Не удалось создать категорию:", error);
            alert(`Ошибка создания категории: ${error}`);
        }
    };

    const handleDeleteCategory = async (categoryName: string) => {
        if (!window.confirm(`Вы уверены, что хотите удалить категорию "${categoryName}" и все ее промпты? Это действие нельзя будет отменить.`)) return;
        try {
            await api.deleteCategory(categoryName);
            await loadCategories();
        } catch (error) {
            console.error("Не удалось удалить категорию:", error);
            alert(`Ошибка удаления категории: ${error}`);
        }
    };

    const handleRenameCategory = async (oldName: string, newName: string) => {
        try {
            await api.renameCategory(oldName, newName);
            await loadCategories(newName);
        } catch(error) {
            console.error("Не удалось переименовать категорию:", error);
            alert(`Ошибка переименования категории: ${error}`);
        }
    };

    const handleCreatePrompt = async (prompt: PromptForCreate) => {
        if (!activeCategory) return;
        try {
            await api.createPrompt(activeCategory, prompt);
            await loadPrompts(activeCategory);
        } catch (error) {
            console.error("Не удалось создать промпт:", error);
            alert(`Ошибка: ${error}`);
        }
    };
    
    const handleUpdatePrompt = async (prompt: Prompt) => {
        if (!activeCategory) return;
        try {
            await api.updatePrompt(activeCategory, prompt.name, prompt);
            setEditingPrompt(null);
            await loadPrompts(activeCategory);
        } catch (error) {
            console.error("Не удалось обновить промпт:", error);
            alert(`Ошибка обновления промпта: ${error}`);
        }
    };

    const handleDeletePrompt = async (promptName: string) => {
        if (!activeCategory || !window.confirm(`Вы уверены, что хотите удалить промпт "${promptName}"?`)) return;
        try {
            await api.deletePrompt(activeCategory, promptName);
            await loadPrompts(activeCategory);
        } catch (error) {
            console.error("Не удалось удалить промпт:", error);
            alert(`Ошибка удаления промпта: ${error}`);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
            <Header title="Библиотека Промптов" />
            
            <CategoryTabs 
                categories={categories}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                onCreateCategory={handleCreateCategory}
                onDeleteCategory={handleDeleteCategory}
                onRenameCategory={handleRenameCategory}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <PromptForm 
                    activeCategory={activeCategory}
                    editingPrompt={editingPrompt}
                    onCreatePrompt={handleCreatePrompt}
                    onUpdatePrompt={handleUpdatePrompt}
                    onCancelEdit={() => setEditingPrompt(null)}
                />

                <PromptList
                    prompts={prompts}
                    activeCategory={activeCategory}
                    onEditPrompt={setEditingPrompt}
                    onDeletePrompt={handleDeletePrompt}
                />
            </div>
        </div>
    );
};

export default PromptLibrary;