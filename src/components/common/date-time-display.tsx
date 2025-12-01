import React from 'react';
import dayjs from 'dayjs';
import { CalendarClock, CalendarDays, Clock } from 'lucide-react';

type DateTimeMode = 'datetime' | 'date' | 'time';

interface DateTimeDisplayProps {
    value?: string | null;
    mode?: DateTimeMode;
    /**
     * @description Boş değerler için gösterilecek metin
     */
    placeholder?: string;
}

const FORMAT_MAP: Record<DateTimeMode, string> = {
    datetime: 'DD.MM.YYYY HH:mm',
    date: 'DD.MM.YYYY',
    time: 'HH:mm',
};

const ICON_MAP: Record<DateTimeMode, React.ComponentType<{ className?: string }>> = {
    datetime: CalendarClock,
    date: CalendarDays,
    time: Clock,
};

/**
 * @description
 * Tek bir bileşen ile tarih + saat / sadece tarih / sadece saat gösterimi yapar.
 * Tüm tarih formatlamaları dayjs üzerinden yönetilir.
 */
const DateTimeDisplay = ({
    value,
    mode = 'datetime',
    placeholder = '-',
}: DateTimeDisplayProps) => {
    const format = FORMAT_MAP[mode];
    const Icon = ICON_MAP[mode];

    if (!value) {
        return (
            <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-border/70 bg-muted/40 px-2 py-0.5 text-[11px] text-muted-foreground">
                <Icon className="h-3 w-3 text-muted-foreground" />
                <span>{placeholder}</span>
            </span>
        );
    }

    const date = dayjs(value);

    if (!date.isValid()) {
        return <span className="text-xs text-destructive">Geçersiz tarih</span>;
    }

    const formatted = date.format(format);

    return (
        <span className="inline-flex items-center gap-1 p-2 rounded-full border border-border bg-background text-[11px] text-foreground shadow-sm">
            <Icon className="h-3 w-3 text-primary/80" />
            <span className="font-mono tracking-tight">{formatted}</span>
        </span>
    );
};

export default DateTimeDisplay;


