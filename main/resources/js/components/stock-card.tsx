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
    ItemTitle} from "@/components/ui/item";
import {ScrollArea} from "@/components/ui/scroll-area";

export interface StockItem {
    name: string;
    Stock: number;
    Emoji?: string;
    image: string;
    Tier?: string;
    Set?: string;
}

import { useRefreshCountdown } from "@/hooks/use-refresh-countdown";

interface StockCardProps {
    title: string;
    items: StockItem[];
    lastRestock: string; // military time hh:mm
    intervalMinutes: number;
}

export default function StockCard({
                                      title,
                                      items,
                                      lastRestock,
                                      intervalMinutes,
                                  }: StockCardProps) {
    const remaining = useRefreshCountdown(lastRestock, intervalMinutes);

    return (
        <Card className="bg-background/20 hover:bg-primary/20 max-w-md">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    Refreshes in: {remaining}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <ScrollArea className="h-[24rem] overflow-y-auto">
                    <div className="flex flex-col items-stretch gap-3">
                        {items.map((item, i) => (
                            <Item variant="muted" key={i} className="bg-primary/10">
                                <ItemMedia variant="image">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="rounded-md"
                                    />
                                </ItemMedia>

                                <ItemContent>
                                    <ItemTitle>
                                        {item.name}
                                    </ItemTitle>
                                </ItemContent>

                                <ItemContent>
                                    <ItemDescription>x{item.Stock}</ItemDescription>
                                </ItemContent>
                            </Item>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
