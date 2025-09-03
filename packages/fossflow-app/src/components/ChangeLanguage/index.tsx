import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './styles.css';
import { supportedLanguages } from '../../i18n';

const ChangeLanguage = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState(i18n.language || 'en');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        setCurrentLang(lang);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="language-selector" ref={dropdownRef}>
            <div 
                className="language-display" 
                onMouseEnter={() => setIsOpen(true)}
            >
                A/文
            </div>
            {isOpen && (
                <div className="language-dropdown">
                    {supportedLanguages.map(item => (
                            <div
                                key={item.value}
                                className={`language-option ${currentLang === item.value ? 'active' : ''}`}
                                onClick={() => changeLanguage(item.value)}
                            >
                                {item.label}
                            </div>
                        ))
                    }
                </div>
            )}
        </div>
    );
};

export default ChangeLanguage;