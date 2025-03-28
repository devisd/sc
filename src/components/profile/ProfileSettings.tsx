import { useState, useEffect } from 'react';
import { getCurrentUser, getUserProfile, updateUserProfile, UserProfile } from '../../supabase/auth';
import { useRouter } from 'next/navigation';
import styles from './ProfileSettings.module.scss';

export const ProfileSettings = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [profile, setProfile] = useState<Partial<UserProfile>>({
        first_name: '',
        last_name: '',
        position: '',
        organization: '',
        address: '',
        display_name: '',
        photo_url: '',
        email: '',
    });

    useEffect(() => {
        // Загружаем профиль пользователя при монтировании компонента
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const currentUser = await getCurrentUser();
                if (!currentUser) {
                    router.push('/auth');
                    return;
                }
                const userProfile = await getUserProfile(currentUser.id);
                if (userProfile) {
                    setProfile({
                        first_name: userProfile.first_name || '',
                        last_name: userProfile.last_name || '',
                        position: userProfile.position || '',
                        organization: userProfile.organization || '',
                        address: userProfile.address || '',
                        display_name: userProfile.display_name || '',
                        photo_url: userProfile.photo_url || '',
                        email: userProfile.email || currentUser.email || '',
                    });
                }
            } catch (error) {
                console.error('Ошибка загрузки профиля:', error);
                setError('Не удалось загрузить профиль пользователя');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setSaving(true);
        setLoading(true);

        try {
            const currentUser = await getCurrentUser();
            if (!currentUser) {
                router.push('/auth');
                return;
            }
            await updateUserProfile(currentUser.id, {
                display_name: profile.display_name,
                first_name: profile.first_name,
                last_name: profile.last_name,
                position: profile.position,
                organization: profile.organization,
                address: profile.address
            });
            setSuccess(true);
        } catch (error: any) {
            console.error('Ошибка обновления профиля:', error);
            setError(error.message || 'Произошла ошибка при обновлении профиля');
        } finally {
            setSaving(false);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Настройки профиля</h2>

            {error && (
                <div className={styles.errorMessage}>
                    {error}
                </div>
            )}

            {success && (
                <div className={styles.successMessage}>
                    Профиль успешно обновлен!
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.gridContainer}>
                    <div>
                        <label htmlFor="first_name" className={styles.label}>
                            Имя
                        </label>
                        <input
                            id="first_name"
                            name="first_name"
                            type="text"
                            value={profile.first_name}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>

                    <div>
                        <label htmlFor="last_name" className={styles.label}>
                            Фамилия
                        </label>
                        <input
                            id="last_name"
                            name="last_name"
                            type="text"
                            value={profile.last_name}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className={styles.label}>
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={profile.email}
                        disabled
                        className={styles.inputDisabled}
                    />
                    <p className={styles.helperText}>Email нельзя изменить.</p>
                </div>

                <div>
                    <label htmlFor="position" className={styles.label}>
                        Должность
                    </label>
                    <input
                        id="position"
                        name="position"
                        type="text"
                        value={profile.position}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>

                <div>
                    <label htmlFor="organization" className={styles.label}>
                        Организация
                    </label>
                    <input
                        id="organization"
                        name="organization"
                        type="text"
                        value={profile.organization}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>

                <div>
                    <label htmlFor="address" className={styles.label}>
                        Адрес
                    </label>
                    <input
                        id="address"
                        name="address"
                        type="text"
                        value={profile.address}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>

                <div>
                    <label htmlFor="photo_url" className={styles.label}>
                        URL фотографии
                    </label>
                    <input
                        id="photo_url"
                        name="photo_url"
                        type="text"
                        value={profile.photo_url}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>

                <div className={styles.buttonContainer}>
                    <button
                        type="submit"
                        disabled={saving}
                        className={styles.submitButton}
                    >
                        {saving ? 'Сохранение...' : 'Сохранить'}
                    </button>
                </div>
            </form>
        </div>
    );
}; 