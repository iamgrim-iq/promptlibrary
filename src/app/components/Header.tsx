"use client";

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    const { theme, setTheme } = useTheme();

    return (
        <header className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-foreground">{title}</h1>
            <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-muted transition-all duration-300 transform hover:scale-110"
            >
                {theme === 'dark' ? <Sun /> : <Moon />}
            </button>
        </header>
    );
};

export default Header;
