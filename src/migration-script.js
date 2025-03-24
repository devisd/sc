// Скрипт для миграции: добавление orderCounter и присвоение номеров заказам
// Запустить из корня проекта: node src/migration-script.js

import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = path.join(__dirname, 'data/db.json');

// Обновление базы данных
async function migrateDatabase() {
    try {
        // Чтение текущего файла БД
        const data = fs.readFileSync(dbPath, 'utf8');
        let db = JSON.parse(data);

        // Проверяем, есть ли в базе поле orderCounter
        if (!db.hasOwnProperty('orderCounter')) {
            console.log('Добавляем поле orderCounter в базу данных');
            db.orderCounter = 0;
        }

        // Проверяем, все ли заказы имеют orderNumber, и находим максимальный номер
        let maxOrderNumber = db.orderCounter || 0;
        let needsMigration = false;

        console.log(`Всего заказов в базе: ${db.orders.length}`);

        db.orders.forEach((order) => {
            if (!order.hasOwnProperty('orderNumber')) {
                needsMigration = true;
                console.log(`Заказ с ID ${order.id} не имеет номера. Устанавливаем номер.`);

                // Присваиваем номер, увеличивая счетчик
                db.orderCounter += 1;
                order.orderNumber = db.orderCounter;
            } else {
                // Если у заказа уже есть номер, обновляем счетчик, если номер больше текущего значения
                maxOrderNumber = Math.max(maxOrderNumber, order.orderNumber);
            }
        });

        // Если макс. номер больше текущего счетчика, обновляем счетчик
        if (maxOrderNumber > db.orderCounter) {
            console.log(`Обновляем orderCounter до ${maxOrderNumber}`);
            db.orderCounter = maxOrderNumber;
        }

        if (!needsMigration && db.orderCounter > 0) {
            console.log('Все заказы уже имеют номера, миграция не требуется.');
            return;
        }

        // Сохраняем обновленную БД
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
        console.log('Миграция успешно завершена. База данных обновлена.');
        console.log(`Текущее значение orderCounter: ${db.orderCounter}`);
    } catch (error) {
        console.error('Ошибка при выполнении миграции:', error);
    }
}

migrateDatabase(); 