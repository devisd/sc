'use client';

import { ProfileSettings } from '../../components/profile/ProfileSettings';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import styles from './page.module.scss';

export default function ProfilePage() {
    return (
        <ProtectedRoute>
            <div className={styles.pageContainer}>
                <h1 className={styles.title}>
                    Личный кабинет
                </h1>

                <div className={styles.card}>
                    <ProfileSettings />
                </div>
            </div>
        </ProtectedRoute>
    );
} 