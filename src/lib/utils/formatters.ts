/**
 * Форматирует дату в формат ДД.ММ.ГГГГ
 */
export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

/**
 * Форматирует дату и время в формат ДД.ММ.ГГГГ ЧЧ:ММ
 */
export function formatDateTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Форматирует сумму в рублях
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
    }).format(amount);
}

/**
 * Форматирует номер телефона в читаемый вид
 */
export function formatPhone(phone: string): string {
    // Удаляем все нецифровые символы
    const cleaned = phone.replace(/\D/g, '');

    // Если длина не соответствует российскому номеру (11 цифр), возвращаем как есть
    if (cleaned.length !== 11) {
        return phone;
    }

    // Форматируем в виде +7 (XXX) XXX-XX-XX
    return `+${cleaned[0]} (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7, 9)}-${cleaned.substring(9, 11)}`;
} 