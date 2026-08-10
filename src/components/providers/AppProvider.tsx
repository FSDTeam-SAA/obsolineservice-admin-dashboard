"use client"
import React from 'react'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient();
    return (
        <div>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </div>
    )
}

export default AppProvider