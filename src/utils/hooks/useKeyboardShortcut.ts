import { useEffect } from 'react';

interface UseKeyboardShortcutOptions {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  onPress: (e: KeyboardEvent) => void;
  enabled?: boolean;
}

/**
 * Klavye kısayolu için custom hook
 * @param options - Klavye kısayolu seçenekleri
 * @example
 * useKeyboardShortcut({
 *   key: 'k',
 *   metaKey: true, // Windows için Alt, macOS için Command
 *   onPress: () => setOpen(prev => !prev)
 * });
 */
export const useKeyboardShortcut = ({
  key,
  ctrlKey = false,
  metaKey = false,
  onPress,
  enabled = true,
}: UseKeyboardShortcutOptions) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const keyMatch = e.key.toLowerCase() === key.toLowerCase();
      const ctrlMatch = ctrlKey ? e.ctrlKey : !e.ctrlKey;
      const metaMatch = metaKey ? e.metaKey : !e.metaKey;

      if (keyMatch && ctrlMatch && metaMatch) {
        e.preventDefault();
        onPress(e);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [key, ctrlKey, metaKey, onPress, enabled]);
};
