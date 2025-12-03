import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle
} from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Cloud, CloudRain, CloudSnow, Sun, Thermometer, Wind, Zap } from "lucide-react";
import { useState, useEffect } from 'react';

export interface WeatherItem {
    Name: string;
    DisplayName: string;
    Image: string;
    Description: string;
    LastSeen: number;
    start_timestamp_unix: number;
    end_timestamp_unix: number;
    active?: boolean;
    duration?: number;
    weather?: string;
}

interface WeatherCardProps {
    title: string;
    items: WeatherItem[];
    className?: string;
}

// Get weather icon based on event name - safe version
const getWeatherIcon = (eventName?: string) => {
    if (!eventName) return Cloud;

    const name = eventName.toLowerCase();

    if (name.includes('storm') || name.includes('rain')) return CloudRain;
    if (name.includes('frozen') || name.includes('icy') || name.includes('snow')) return CloudSnow;
    if (name.includes('heat') || name.includes('sun')) return Sun;
    if (name.includes('fog') || name.includes('mist')) return Cloud;
    if (name.includes('wind') || name.includes('breeze')) return Wind;
    if (name.includes('golden') || name.includes('galactic') || name.includes('rainbow')) return Zap;
    if (name.includes('volcano') || name.includes('fire') || name.includes('lava')) return Thermometer;
    return Cloud;
};

// Format time ago
const timeAgo = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return `${Math.floor(diff / 604800)}w ago`;
};

// Component that renders a single weather item WITHOUT hooks
const WeatherItemCard = ({ item }: { item: WeatherItem }) => {
    const [endsIn, setEndsIn] = useState<string>("N/A");
    const [imageError, setImageError] = useState(false);
    const [hasValidImage, setHasValidImage] = useState(false);

    useEffect(() => {
        // Check if image URL is valid before attempting to load
        const image = item.Image || item.Image || '';
        const isValidImageUrl = image &&
            (image.startsWith('http://') ||
                image.startsWith('https://') ||
                image.startsWith('data:image'));
        setHasValidImage(!!isValidImageUrl);
        setImageError(false);
    }, [item.Image, item.Image]);

    useEffect(() => {
        if (item?.end_timestamp_unix) {
            // Calculate countdown manually instead of using hook
            const calculateCountdown = () => {
                const now = Math.floor(Date.now() / 1000);
                const diff = item.end_timestamp_unix - now;

                if (diff <= 0) {
                    setEndsIn("Ended");
                    return;
                }

                const hours = Math.floor(diff / 3600);
                const minutes = Math.floor((diff % 3600) / 60);
                const seconds = diff % 60;

                if (hours > 0) {
                    setEndsIn(`${hours}h ${minutes}m`);
                } else if (minutes > 0) {
                    setEndsIn(`${minutes}m ${seconds}s`);
                } else {
                    setEndsIn(`${seconds}s`);
                }
            };

            calculateCountdown();
            const interval = setInterval(calculateCountdown, 1000);
            return () => clearInterval(interval);
        }
    }, [item?.end_timestamp_unix]);

    // Handle different data formats
    const displayName = item.DisplayName || item.weather || item.Name || "Unknown Event";
    const image = item.Image || item.Image || '';

    const Icon = getWeatherIcon(displayName);
    const ago = item?.LastSeen ? timeAgo(item.LastSeen) : "Unknown";

    return (
        <Item variant="muted" className="bg-primary/10">
            <ItemMedia variant="image">
                <div className="relative">
                    {hasValidImage && !imageError ? (
                        <img
                            src={image}
                            alt={displayName}
                            className="rounded-md w-12 h-12 object-cover"
                            onError={() => {
                                setImageError(true);
                                setHasValidImage(false);
                            }}
                            onLoad={() => setImageError(false)}
                        />
                    ) : (
                        // Show just the icon in a circle when no image
                        <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                            <Icon className="h-6 w-6 text-gray-500" />
                        </div>
                    )}
                    {/* Small icon badge */}
                    <div className="absolute -top-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full">
                        <Icon className="h-3 w-3" />
                    </div>
                </div>
            </ItemMedia>

            <ItemContent>
                <ItemTitle className="text-sm font-medium">
                    {displayName}
                </ItemTitle>
                <ItemDescription className="text-xs space-y-1">
                    <div className="text-gray-500">{ago}</div>
                    <div className="line-clamp-2">{item.Description}</div>
                    {item?.end_timestamp_unix && item.end_timestamp_unix > Date.now() / 1000 && (
                        <div className="text-green-600 font-medium">
                            Ends in: {endsIn}
                        </div>
                    )}
                </ItemDescription>
            </ItemContent>
        </Item>
    );
};

export default function WeatherCard({ title, items = [], className }: WeatherCardProps) {
    // Handle empty items array
    if (!items || items.length === 0) {
        return (
            <Card className={`bg-background/20 hover:bg-primary/20 w-full ${className}`}>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>No events available</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-gray-500">
                        <Cloud className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <div>No events to display</div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={`bg-background/20 hover:bg-primary/20 w-full ${className}`}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{items.length} events</CardDescription>
            </CardHeader>

            <CardContent>
                <ScrollArea className="h-[11rem] overflow-y-auto">
                    <div className="flex flex-col items-stretch gap-3">
                        {items.map((item, i) => (
                            <WeatherItemCard key={i} item={item} />
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
