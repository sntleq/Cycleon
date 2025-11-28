import {
    Card,
    CardContent, CardDescription,
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
import { useCountdownToTimestamp } from "@/hooks/use-countdown-to-timestamp";

export interface WeatherItem {
    weather: string;
    active: boolean;
    duration: number;
    start_timestamp_unix: number;
    end_timestamp_unix: number;
    image: string;
}

interface WeatherCardProps {
    title: string;
    items: WeatherItem[];
    className?: string;
}

export default function WeatherCard({ title, items, className }: WeatherCardProps) {
    return (
        <Card className={`bg-background/20 hover:bg-primary/20 w-full ${className}`}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{items.length} events active</CardDescription>
            </CardHeader>

            <CardContent>
                <ScrollArea className="h-[11rem] overflow-y-auto">
                    <div className="flex flex-col items-stretch gap-3">
                        {items.map((item, i) => {
                            const endsIn = useCountdownToTimestamp(item.end_timestamp_unix);

                            return (
                                <Item variant="muted" key={i} className="bg-primary/10">
                                    <ItemMedia variant="image">
                                        <img
                                            src={item.image}
                                            alt={item.weather}
                                            className="rounded-md"
                                        />
                                    </ItemMedia>

                                    <ItemContent>
                                        <ItemTitle>{item.weather}</ItemTitle>
                                        <ItemDescription>
                                            Ends in: {endsIn}
                                        </ItemDescription>
                                    </ItemContent>
                                </Item>
                            );
                        })}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
