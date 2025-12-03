import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Cloud, CloudRain, CloudSnow, Sun, Thermometer, Wind, AlertCircle } from "lucide-react";

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

interface WeatherCardProps {
    className?: string;
    title: string;
    items: WeatherEventItem[];
    isLoading?: boolean;
    error?: string;
}

export default function WeatherCard({
                                        className = "",
                                        title,
                                        items,
                                        isLoading = false,
                                        error = "",
                                    }: WeatherCardProps) {

    const getWeatherIcon = (weatherType: string) => {
        const type = weatherType.toLowerCase();
        if (type.includes('rain')) return <CloudRain className="h-6 w-6" />;
        if (type.includes('snow')) return <CloudSnow className="h-6 w-6" />;
        if (type.includes('sun') || type.includes('heat')) return <Sun className="h-6 w-6" />;
        if (type.includes('wind')) return <Wind className="h-6 w-6" />;
        return <Cloud className="h-6 w-6" />;
    };

    if (isLoading) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-32">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                            <p className="text-gray-500">Loading weather...</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center h-32 text-center p-4">
                        <AlertCircle className="h-12 w-12 text-red-400 mb-3" />
                        <p className="text-red-600 font-medium">{error}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    Current weather conditions in Grow a Garden
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {items.map((weather, index) => (
                        <div key={index} className="flex items-start space-x-4 p-4 bg-card rounded-lg border">
                            <div className="flex-shrink-0">
                                {getWeatherIcon(weather.Name)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">{weather.DisplayName}</h3>
                                    <span className={`px-2 py-1 text-xs rounded ${weather.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {weather.active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{weather.Description}</p>
                                <div className="mt-3 space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Started:</span>
                                        <span>{new Date(weather.start_timestamp_unix * 1000).toLocaleTimeString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Ends:</span>
                                        <span>{new Date(weather.end_timestamp_unix * 1000).toLocaleTimeString()}</span>
                                    </div>
                                    {weather.duration && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Duration:</span>
                                            <span>{Math.round(weather.duration / 3600)} hours</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {items.length === 0 && (
                        <div className="col-span-2 text-center py-8 text-gray-500">
                            No weather data available
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
