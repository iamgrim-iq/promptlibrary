"use client";

export interface Prompt {
    name: string;
    content: string;
    tag?: string;
}

const API_URL = 'http://localhost:3001/api';

const handleFetchError = async (response: Response) => {
    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.error || 'Произошла неизвестная ошибка';
        } catch (e) {
            errorMessage = errorText;
        }
        throw new Error(errorMessage);
    }
    return response.json();
};

export const fetchCategories = async (): Promise<string[]> => {
    const response = await fetch(`${API_URL}/categories`);
    return handleFetchError(response);
};

export const createCategory = async (categoryName: string): Promise<any> => {
    const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryName }),
    });
    return handleFetchError(response);
};

export const renameCategory = async (oldCategoryName: string, newCategoryName: string): Promise<any> => {
    const response = await fetch(`${API_URL}/categories/${encodeURIComponent(oldCategoryName)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newCategoryName }),
    });
    return handleFetchError(response);
};

export const deleteCategory = async (categoryName: string): Promise<any> => {
    const response = await fetch(`${API_URL}/categories/${encodeURIComponent(categoryName)}`, {
        method: 'DELETE',
    });
    return handleFetchError(response);
};

export const fetchPrompts = async (category: string): Promise<Prompt[]> => {
    const response = await fetch(`${API_URL}/categories/${encodeURIComponent(category)}/prompts`);
    const data = await handleFetchError(response);
    return data.map((p: Prompt) => ({ ...p, tag: p.tag || 'ПРОМПТ' }));
};

export const createPrompt = async (category: string, prompt: Omit<Prompt, 'name'> & { promptName: string }): Promise<any> => {
    const response = await fetch(`${API_URL}/categories/${encodeURIComponent(category)}/prompts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prompt),
    });
    return handleFetchError(response);
};

export const updatePrompt = async (category: string, promptName: string, prompt: Partial<Omit<Prompt, 'name'>>): Promise<any> => {
    const response = await fetch(`${API_URL}/categories/${encodeURIComponent(category)}/prompts/${encodeURIComponent(promptName)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prompt),
    });
    return handleFetchError(response);
};

export const deletePrompt = async (category: string, promptName: string): Promise<any> => {
    const response = await fetch(`${API_URL}/categories/${encodeURIComponent(category)}/prompts/${encodeURIComponent(promptName)}`, {
        method: 'DELETE',
    });
    return handleFetchError(response);
}; 