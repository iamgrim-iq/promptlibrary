"use client";

import React, { useState, useEffect } from 'react';
import { Prompt } from '@/lib/api';

type PromptForCreate = Omit<Prompt, 'name'> & { promptName: string };

interface PromptFormProps {
    activeCategory: string | null;
    editingPrompt: Prompt | null;
    onCreatePrompt: (prompt: PromptForCreate) => Promise<void>;
    onUpdatePrompt: (prompt: Prompt) => Promise<void>;
    onCancelEdit: () => void;
}

const PromptForm: React.FC<PromptFormProps> = ({
    activeCategory,
    editingPrompt,
    onCreatePrompt,
    onUpdatePrompt,
    onCancelEdit,
}) => {
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [tag, setTag] = useState('ПРОМПТ');

    useEffect(() => {
        if (editingPrompt) {
            setName(editingPrompt.name);
            setContent(editingPrompt.content);
            setTag(editingPrompt.tag || 'ПРОМПТ');
        } else {
            setName('');
            setContent('');
            setTag('ПРОМПТ');
        }
    }, [editingPrompt]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingPrompt) {
            await onUpdatePrompt({ name, content, tag });
        } else {
            if (!name.trim() || !content.trim()) {
                alert("Название и содержимое промпта не могут быть пустыми.");
                return;
            }
            await onCreatePrompt({ promptName: name, content, tag });
            setName('');
            setContent('');
            setTag('ПРОМПТ');
        }
    };
    
    const handleTagChange = (newTag: 'ПРОМПТ' | 'СИСТЕМА') => {
        setTag(newTag);
    }

    return (
        <div className="lg:col-span-1 bg-card p-4 rounded-lg shadow-sm animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-xl font-semibold mb-3 text-foreground">
                {editingPrompt ? 'Редактировать промпт' : activeCategory ? 'Создать новый промпт' : 'Выберите категорию'}
            </h2>
            {activeCategory ? (
                <form onSubmit={handleSubmit}>
                    {!editingPrompt && (
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Название промпта"
                            className="bg-input border border-border rounded-md px-3 py-2 w-full mb-3 focus:ring-2 focus:ring-ring focus:outline-none transition-shadow"
                        />
                    )}
                    <div className="mb-3">
                        <label className="block text-sm font-medium mb-1 text-muted-foreground">Тег:</label>
                        <div className="flex gap-2">
                             <button type="button" className={`px-4 py-2 rounded-md border transition-colors duration-200 text-sm font-semibold focus:outline-none ${ tag === 'ПРОМПТ' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border hover:bg-secondary'}`} onClick={() => handleTagChange('ПРОМПТ')}> ПРОМПТ </button>
                             <button type="button" className={`px-4 py-2 rounded-md border transition-colors duration-200 text-sm font-semibold focus:outline-none ${ tag === 'СИСТЕМА' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border hover:bg-secondary'}`} onClick={() => handleTagChange('СИСТЕМА')}> СИСТЕМА </button>
                        </div>
                    </div>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Содержимое промпта..."
                        className="bg-input border border-border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-ring focus:outline-none transition-shadow"
                        rows={8}
                    />
                    <div className="flex justify-end gap-2 mt-3">
                        {editingPrompt && (
                            <button type="button" onClick={onCancelEdit} className="bg-muted text-muted-foreground px-4 py-2 rounded-md hover:bg-secondary transition-colors">
                                Отмена
                            </button>
                        )}
                        <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors transform hover:scale-105">
                            {editingPrompt ? 'Сохранить изменения' : 'Создать промпт'}
                        </button>
                    </div>
                </form>
            ) : (
                <p className="text-muted-foreground">Пожалуйста, создайте или выберите категорию, чтобы начать добавлять промпты.</p>
            )}
        </div>
    );
};

export default PromptForm;
