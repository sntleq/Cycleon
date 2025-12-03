import { useEffect, useState } from "react";
import { H2 } from '@/components/h2';
import { H3 } from '@/components/h3';
import { H4 } from '@/components/h4';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { growAGarden } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import StockCard from "@/components/stock-card";
import WeatherCard from "@/components/weather-card";
import { useRefreshCountdown } from "@/hooks/use-refresh-countdown";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Grow a Garden',
        href: growAGarden().url,
    },
];

export interface StockItem {
    name: string;
    Stock: number;
    Emoji?: string;
    image: string;
    Tier?: string;
    Set?: string;
}

interface WeatherEventItem {
    Name: string;
    DisplayName: string;
    Image: string;
    Description: string;
    LastSeen: number;
    start_timestamp_unix: number;
    end_timestamp_unix: number;
    active?: boolean;
    duration?: number;
}

export default function GrowAGarden() {
    const [stockData, setStockData] = useState<{
        seed_stock: StockItem[];
        gear_stock: StockItem[];
        egg_stock: StockItem[];
        cosmetic_stock: StockItem[];
        Season_Stock: StockItem[];
    } | null>(null);

    const [weatherEvents, setWeatherEvents] = useState<WeatherEventItem[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(true);

    // Helper to calculate actual restock times
    const calculateRestockTimes = (intervalMinutes: number) => {
        const now = new Date();
        const intervalMs = intervalMinutes * 60 * 1000;

        // Shops restock at specific intervals from midnight
        const midnight = new Date(now);
        midnight.setHours(0, 0, 0, 0);

        const timeSinceMidnight = now.getTime() - midnight.getTime();
        const intervalsSinceMidnight = Math.floor(timeSinceMidnight / intervalMs);

        const lastRestockTime = new Date(midnight.getTime() + (intervalsSinceMidnight * intervalMs));
        const nextRestockTime = new Date(lastRestockTime.getTime() + intervalMs);

        const formatTime = (date: Date) => {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };

        return {
            lastRestock: formatTime(lastRestockTime),
            nextRestock: formatTime(nextRestockTime)
        };
    };

    // Calculate restock times
    const seedRestock = calculateRestockTimes(5);
    const gearRestock = calculateRestockTimes(5);
    const eggRestock = calculateRestockTimes(30);
    const cosmeticRestock = calculateRestockTimes(240);
    const seasonRestock = calculateRestockTimes(5);

    // Daily Deals restock calculation
    const getDailyDealsRestock = () => {
        const now = new Date();
        const nextRestock = new Date(now);
        nextRestock.setHours(8, 0, 0, 0);

        if (now.getHours() >= 8) {
            nextRestock.setDate(nextRestock.getDate() + 1);
        }

        const lastRestock = new Date(nextRestock);
        lastRestock.setDate(lastRestock.getDate() - 1);

        const formatTime = (date: Date) => {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };

        return {
            lastRestock: formatTime(lastRestock),
            nextRestock: formatTime(nextRestock)
        };
    };

    const dailyDealsRestock = getDailyDealsRestock();

    // Use your refresh countdown hook
    const seedCountdown = useRefreshCountdown("00:00", 5);
    const gearCountdown = useRefreshCountdown("00:00", 5);
    const eggCountdown = useRefreshCountdown("00:00", 30);
    const cosmeticCountdown = useRefreshCountdown("00:00", 240);
    const seasonCountdown = useRefreshCountdown("00:00", 5);
    const dailyDealsCountdown = useRefreshCountdown("08:00", 1440);

    useEffect(() => {
        const fetchStock = async () => {
            try {
                const res = await fetch('/proxy/stock');
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                setStockData(data);
            } catch (error) {
                console.error("Failed to fetch stock via proxy:", error);
            }
        };

        fetchStock();
        const interval = setInterval(fetchStock, 60_000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchWeatherEvents = async () => {
            try {
                setLoadingEvents(true);
                const res = await fetch('/proxy/events');
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                setWeatherEvents(data.lastSeenEvents || []);
            } catch (error) {
                console.error("Failed to fetch weather events:", error);
                setWeatherEvents([]);
            } finally {
                setLoadingEvents(false);
            }
        };

        fetchWeatherEvents();
        const interval = setInterval(fetchWeatherEvents, 60_000);
        return () => clearInterval(interval);
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs} data-theme="red">
            <Head title="Grow a Garden" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 bg-transparent">
                <div className="flex flex-col items-center justify-center w-full my-16 leading-none bg-transparent">
                    <H3>
                        Stocks and Weather Events Live Tracking and Forecast for
                    </H3>
                    <H2 className="text-sidebar-primary">
                        Grow a Garden
                    </H2>
                </div>

                <H4>
                    Live Stocks and Weather Events
                </H4>

                <div className="grid auto-rows-min gap-4 md:grid-cols-3 bg-transparent">
                    <StockCard
                        title="Seed Shop"
                        items={stockData?.seed_stock ?? []}
                        lastRestock={seedRestock.lastRestock}
                        nextRestock={seedRestock.nextRestock}
                        countdown={seedCountdown}
                        intervalMinutes={5}
                    />
                    <StockCard
                        title="Daily Deals"
                        items={stockData?.seed_stock ?? []}
                        lastRestock={dailyDealsRestock.lastRestock}
                        nextRestock={dailyDealsRestock.nextRestock}
                        countdown={dailyDealsCountdown}
                        intervalMinutes={1440}
                    />
                    <StockCard
                        title="Gear Shop"
                        items={stockData?.gear_stock ?? []}
                        lastRestock={gearRestock.lastRestock}
                        nextRestock={gearRestock.nextRestock}
                        countdown={gearCountdown}
                        intervalMinutes={5}
                    />
                    <StockCard
                        title="Egg Shop"
                        items={stockData?.egg_stock ?? []}
                        lastRestock={eggRestock.lastRestock}
                        nextRestock={eggRestock.nextRestock}
                        countdown={eggCountdown}
                        intervalMinutes={30}
                    />
                    <StockCard
                        title="Cosmetic Shop"
                        items={stockData?.cosmetic_stock ?? []}
                        lastRestock={cosmeticRestock.lastRestock}
                        nextRestock={cosmeticRestock.nextRestock}
                        countdown={cosmeticCountdown}
                        intervalMinutes={240}
                    />
                    <StockCard
                        title="Season Pass Shop"
                        items={stockData?.Season_Stock ?? []}
                        lastRestock={seasonRestock.lastRestock}
                        nextRestock={seasonRestock.nextRestock}
                        countdown={seasonCountdown}
                        intervalMinutes={5}
                    />

                    <WeatherCard
                        className="col-span-3"
                        title="Weather Events"
                        items={weatherEvents}
                    />
                </div>
                <H4 className="mt-20">
                    Stocks and Weather Events Forecast
                </H4>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border bg-transparent">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
