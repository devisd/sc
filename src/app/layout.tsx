import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeRegistry from '@/components/ThemeRegistry';
import Layout from '@/components/Layout';

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
    title: "Сервисный центр CRM",
    description: "Приложение для учета клиентов сервисного центра",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru">
            <body className={inter.className}>
                <ThemeRegistry>
                    <Layout>
                        {children}
                    </Layout>
                </ThemeRegistry>
            </body>
        </html>
    );
} 