"use client";

import React, { useState } from 'react';
import { Edit, Trash, Check, X, Plus } from 'lucide-react';
import ContextMenuPortal from './ContextMenuPortal';

interface CategoryTabsProps {
    categories: string[];
    activeCategory: string | null;
    onSelectCategory: (category: string) => void;
    onCreateCategory: (name: string) => Promise<void>;
    onDeleteCategory: (name: string) => Promise<void>;
    onRenameCategory: (oldName: string, newName: string) => Promise<void>;
}

interface ContextMenuState {
    x: number;
    y: number;
    categoryName: string;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
    categories,
    activeCategory,
    onSelectCategory,
    onCreateCategory,
    onDeleteCategory,
    onRenameCategory,
}) => {
    const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
    const [renamingCategory, setRenamingCategory] = useState<string | null>(null);
    const [newCategoryEditName, setNewCategoryEditName] = useState('');
    const [newCategoryName, setNewCategoryName] = useState('');

    React.useEffect(() => {
        const handleClick = () => setContextMenu(null);
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);
    
    const handleCategoryContextMenu = (event: React.MouseEvent, categoryName: string) => {
        event.preventDefault();
        event.stopPropagation();
        setContextMenu({ x: event.clientX, y: event.clientY, categoryName });
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;
        await onCreateCategory(newCategoryName.trim());
        setNewCategoryName('');
    };
    
    const startRename = (name: string) => {
        setRenamingCategory(name);
        setNewCategoryEditName(name);
        setContextMenu(null);
    };

    const cancelRename = () => {
        setRenamingCategory(null);
        setNewCategoryEditName('');
    };

    const handleRename = async () => {
        if (!renamingCategory || !newCategoryEditName.trim() || renamingCategory === newCategoryEditName.trim()) {
            cancelRename();
            return;
        }
        await onRenameCategory(renamingCategory, newCategoryEditName.trim());
        cancelRename();
    };

    const handleDelete = (name: string) => {
        onDeleteCategory(name);
        setContextMenu(null);
    }

    return (
        <>
            <ContextMenuPortal>
                {contextMenu && (
                    <div
                        style={{ top: contextMenu.y, left: contextMenu.x }}
                        className="fixed bg-card border border-border rounded-md shadow-lg p-2 z-50 animate-fade-in-fast"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => startRename(contextMenu.categoryName)}
                            className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted rounded-md flex items-center gap-2"
                        >
                            <Edit size={14} /> Переименовать
                        </button>
                        <button
                            onClick={() => handleDelete(contextMenu.categoryName)}
                            className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted text-destructive rounded-md flex items-center gap-2"
                        >
                            <Trash size={14} /> Удалить
                        </button>
                    </div>
                )}
            </ContextMenuPortal>

            <div className="bg-card p-4 rounded-lg shadow-sm mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-xl font-semibold mb-3 text-foreground">Добавить новую категорию</h2>
                <div className="flex items-center gap-2">
                    <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleCreateCategory()} placeholder="Введите название категории..." className="bg-input border border-border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-ring focus:outline-none transition-shadow"/>
                    <button onClick={handleCreateCategory} className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 flex items-center gap-2 transition-all duration-200 transform hover:scale-105">
                        <Plus size={18} /> Добавить
                    </button>
                </div>
            </div>

            <div className="flex border-b border-border mb-4 overflow-x-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
                {categories.map((category) => (
                    <div key={category} className="flex-shrink-0">
                        {renamingCategory === category ? (
                            <div className="flex items-center p-2">
                                <input type="text" value={newCategoryEditName} onChange={(e) => setNewCategoryEditName(e.target.value)} onBlur={handleRename} onKeyDown={(e) => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') cancelRename(); }} className="bg-input border border-ring rounded-md px-2 py-1 text-sm focus:outline-none" autoFocus />
                                <button onClick={handleRename} className="p-1.5 ml-1 rounded-md hover:bg-muted"><Check size={16} className="text-green-500" /></button>
                                <button onClick={cancelRename} className="p-1.5 rounded-md hover:bg-muted"><X size={16} className="text-red-500" /></button>
                            </div>
                        ) : (
                            <button onContextMenu={(e) => handleCategoryContextMenu(e, category)} onClick={() => onSelectCategory(category)} className={`py-3 px-4 text-sm font-medium transition-colors duration-300 w-full text-left ${ activeCategory === category ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground' }`} >
                                {category}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};

export default CategoryTabs;
