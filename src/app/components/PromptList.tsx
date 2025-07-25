"use client";

import React, { useState } from 'react';
import { Prompt } from '@/lib/api';
import { Edit, Trash, Copy } from 'lucide-react';

interface PromptListProps {
    prompts: Prompt[];
    activeCategory: string | null;
    onEditPrompt: (prompt: Prompt) => void;
    onDeletePrompt: (name: string) => Promise<void>;
}

const PromptList: React.FC<PromptListProps> = ({ prompts, activeCategory, onEditPrompt, onDeletePrompt }) => {
    const [copiedPromptName, setCopiedPromptName] = useState<string | null>(null);

    const handleCopyPrompt = (promptName: string, content: string) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(content).then(() => {
                setCopiedPromptName(promptName);
                setTimeout(() => setCopiedPromptName(null), 2000);
            }).catch(err => {
                console.error('Не удалось скопировать через Clipboard API: ', err);
                alert('Не удалось скопировать промпт.');
            });
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = content;
            textArea.style.position = "fixed";
            textArea.style.top = "-9999px";
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    setCopiedPromptName(promptName);
                    setTimeout(() => setCopiedPromptName(null), 2000);
                } else {
                     alert('Не удалось скопировать промпт.');
                }
            } catch (err) {
                console.error('Не удалось скопировать через execCommand: ', err);
                alert('Не удалось скопировать промпт.');
            } finally {
                 document.body.removeChild(textArea);
            }
        }
    };
    
    return (
        <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prompts.map((prompt, index) => (
                    <div key={`${activeCategory}-${prompt.name}`} className="bg-card p-4 rounded-lg shadow-sm group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between" style={{ animationDelay: `${index * 0.05}s` }}>
                         <div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-foreground break-all">{prompt.name}</h3>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0 ml-2">
                                    <button onClick={() => onEditPrompt(prompt)} className="p-1.5 rounded-md hover:bg-muted transition-colors"><Edit size={16} className="text-muted-foreground" /></button>
                                    <button onClick={() => onDeletePrompt(prompt.name)} className="p-1.5 rounded-md hover:bg-muted transition-colors"><Trash size={16} className="text-destructive" /></button>
                                </div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full text-white ${prompt.tag === 'СИСТЕМА' ? 'bg-blue-500' : 'bg-green-500'}`}>{prompt.tag || 'ПРОМПТ'}</span>
                            <p className="text-muted-foreground text-sm my-3 break-words">{prompt.content.substring(0, 120)}{prompt.content.length > 120 ? '...' : ''}</p>
                        </div>
                        <button onClick={() => handleCopyPrompt(prompt.name, prompt.content)} className="w-full mt-auto bg-secondary text-secondary-foreground py-2 rounded-md hover:bg-muted text-sm flex items-center justify-center gap-2 transition-colors duration-300 disabled:opacity-50" disabled={copiedPromptName === prompt.name}>
                            {copiedPromptName === prompt.name ? 'Скопировано!' : ( <> <Copy size={14} /> Копировать промпт </> )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PromptList;
