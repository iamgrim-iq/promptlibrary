"use client";

import React from 'react';
import { createPortal } from 'react-dom';

interface ContextMenuPortalProps {
    children: React.ReactNode;
}

const ContextMenuPortal: React.FC<ContextMenuPortalProps> = ({ children }) => {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    return mounted ? createPortal(children, document.body) : null;
};

export default ContextMenuPortal; 