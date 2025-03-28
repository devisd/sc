import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Инициализация Supabase клиента
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Базовые функции для работы с БД

// Добавление записи в таблицу
export const addRecord = async <T extends object>(
    table: string,
    data: T
) => {
    const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();

    if (error) throw error;
    return result;
};

// Получение записи по ID
export const getRecord = async <T>(
    table: string,
    id: string
) => {
    const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data as T;
};

// Получение всех записей из таблицы
export const getAllRecords = async <T>(
    table: string
) => {
    const { data, error } = await supabase
        .from(table)
        .select('*');

    if (error) throw error;
    return data as T[];
};

// Обновление записи
export const updateRecord = async <T extends object>(
    table: string,
    id: string,
    data: Partial<T>
) => {
    const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return result;
};

// Удаление записи
export const deleteRecord = async (
    table: string,
    id: string
) => {
    const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

    if (error) throw error;
};

// Поиск записей по условию
export const queryRecords = async <T>(
    table: string,
    column: string,
    operator: string,
    value: any
) => {
    const { data, error } = await supabase
        .from(table)
        .select('*')
        .filter(column, operator, value);

    if (error) throw error;
    return data as T[];
}; 