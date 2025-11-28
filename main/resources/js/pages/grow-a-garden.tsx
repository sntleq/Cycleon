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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Grow a Garden',
        href: growAGarden().url,
    },
];

export default function GrowAGarden() {
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
                    <StockCard title="Seed Shop" items={[]} lastRestock="00:00" intervalMinutes={5}/>
                    <StockCard title="Daily Deals" items={[]} lastRestock="08:00" intervalMinutes={1440}/>
                    <StockCard title="Gear Shop" items={[]} lastRestock="00:00" intervalMinutes={5}/>
                    <StockCard title="Egg Shop" items={[]} lastRestock="00:00" intervalMinutes={30}/>
                    <StockCard title="Cosmetic Shop" items={[]} lastRestock="00:00" intervalMinutes={240}/>
                    <StockCard title="Season Pass Shop" items={[]} lastRestock="00:00" intervalMinutes={5}/>
                    <WeatherCard className="col-span-3" title="Weather Events" items={[
                        {
                            "weather": "SummerHarvest",
                            "active": true,
                            "duration": 600,
                            "start_timestamp_unix": 1750579200,
                            "end_timestamp_unix": 1750579800,
                            "image": "https://cdn.3itx.tech/image/GrowAGarden/summerharvest"
                        },
                        {
                            "weather": "SummerHarvest",
                            "active": true,
                            "duration": 600,
                            "start_timestamp_unix": 1750579200,
                            "end_timestamp_unix": 1750579800,
                            "image": "https://cdn.3itx.tech/image/GrowAGarden/summerharvest"
                        }
                    ]}/>
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
