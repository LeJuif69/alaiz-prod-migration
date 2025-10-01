import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type Currency = 'EUR' | 'XAF';

interface CurrencyContextType {
    currency: Currency;
    loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// List of ISO 3166-1 alpha-2 codes for countries in Africa.
const AFRICAN_COUNTRY_CODES = [
  'AO', 'BF', 'BI', 'BJ', 'BW', 'CD', 'CF', 'CG', 'CI', 'CM', 'CV', 'DJ',
  'DZ', 'EG', 'EH', 'ER', 'ET', 'GA', 'GH', 'GM', 'GN', 'GQ', 'GW', 'KE',
  'KM', 'LR', 'LS', 'LY', 'MA', 'MG', 'ML', 'MR', 'MU', 'MW', 'MZ', 'NA',
  'NE', 'NG', 'RE', 'RW', 'SC', 'SD', 'SH', 'SL', 'SN', 'SO', 'SS', 'ST',
  'SZ', 'TD', 'TG', 'TN', 'TZ', 'UG', 'YT', 'ZA', 'ZM', 'ZW'
];


export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currency, setCurrency] = useState<Currency>('EUR');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLocationAndSetCurrency = async () => {
            try {
                // Using ipinfo.io which is generally reliable and provides a country code.
                const response = await fetch('https://ipinfo.io/json');
                if (!response.ok) {
                    throw new Error('Failed to fetch location from ipinfo.io');
                }
                const data = await response.json();
                
                // Check if the user's country is in Africa to set the currency to XAF.
                if (data.country && AFRICAN_COUNTRY_CODES.includes(data.country)) {
                    setCurrency('XAF');
                } else {
                    setCurrency('EUR');
                }
            } catch (error) {
                console.error('Error detecting location, defaulting to EUR:', error);
                setCurrency('EUR'); // Default to EUR on any error.
            } finally {
                setLoading(false);
            }
        };

        fetchLocationAndSetCurrency();
    }, []);

    const value = { currency, loading };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = (): CurrencyContextType => {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};
