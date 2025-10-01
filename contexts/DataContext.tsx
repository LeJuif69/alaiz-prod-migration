
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { getLabelInfo } from '../services/cmsService';
import { ALAIZ_DATA } from '../constants'; // For type inference

type LabelInfo = typeof ALAIZ_DATA.labelInfo;

interface DataContextType {
    labelInfo: LabelInfo | null;
    loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [labelInfo, setLabelInfo] = useState<LabelInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGlobalData = async () => {
            try {
                const info = await getLabelInfo();
                setLabelInfo(info);
            } catch (error) {
                console.error("Failed to fetch global site data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGlobalData();
    }, []);

    return (
        <DataContext.Provider value={{ labelInfo, loading }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
