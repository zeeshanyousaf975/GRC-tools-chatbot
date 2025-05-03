import { useEffect } from 'react';

interface Shortcut {
    key: string;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    action: () => void;
}

export const useKeyboardShortcuts = (shortcuts: Shortcut[]) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            shortcuts.forEach((shortcut) => {
                if (
                    event.key.toLowerCase() === shortcut.key.toLowerCase() &&
                    !!event.ctrlKey === !!shortcut.ctrlKey &&
                    !!event.shiftKey === !!shortcut.shiftKey &&
                    !!event.altKey === !!shortcut.altKey
                ) {
                    event.preventDefault();
                    shortcut.action();
                }
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [shortcuts]);
}; 