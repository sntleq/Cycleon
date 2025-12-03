// components/StockCard.tsx
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
import { Clock } from "lucide-react";
import React from "react";

export interface StockItem {
    name: string;
    Stock: number;
    Emoji?: string;
    image?: string; // Make image optional
    Tier?: string;
    Set?: string;
}

interface StockCardProps {
    title: string;
    items: StockItem[];
    lastRestock: string;
    nextRestock: string;
    countdown: string;
    intervalMinutes: number;
    hideIfNoImages?: boolean; // New prop to hide card when no images
}

export default function StockCard({
                                      title,
                                      items,
                                      lastRestock,
                                      nextRestock,
                                      countdown,
                                      intervalMinutes,
                                      hideIfNoImages = false, // Default to false
                                  }: StockCardProps) {

    // Filter out items without images if hideIfNoImages is true
    const displayItems = React.useMemo(() => {
        if (!items || !Array.isArray(items)) return [];

        if (hideIfNoImages) {
            // Filter out items without images
            return items.filter(item => {
                if (!item.image || typeof item.image !== 'string') return false;
                const trimmedImage = item.image.trim();
                return trimmedImage !== '' &&
                    trimmedImage !== 'null' &&
                    trimmedImage !== 'undefined';
            });
        }

        // Show all items, but handle missing images gracefully
        return items;
    }, [items, hideIfNoImages]);

    // If hideIfNoImages is true and no items have images, return null to hide the card
    if (hideIfNoImages && displayItems.length === 0) {
        return null;
    }

    return (
        <Card className="bg-background/20 hover:bg-primary/20 max-w-md">
            <CardHeader>
                <CardTitle className="text-lg">
                    {title} {hideIfNoImages && `(${displayItems.length})`}
                </CardTitle>
                <CardDescription>
                    <div className="space-y-1">
                        <div>Last restock: {lastRestock}</div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            <span>Restocks in: {countdown}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                            Next: {nextRestock}
                        </div>
                    </div>
                </CardDescription>
            </CardHeader>

            <CardContent>
                <ScrollArea className="h-[24rem] overflow-y-auto">
                    {displayItems.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No items to display
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {displayItems.map((item, i) => (
                                <Item variant="muted" key={i} className="bg-primary/10">
                                    <ItemMedia variant="image">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="rounded-md w-12 h-12 object-cover"
                                                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                                    e.currentTarget.src = 'https://via.placeholder.com/48x48?text=Item';
                                                }}
                                            />
                                        ) : (
                                            <div className="rounded-md w-12 h-12 bg-gray-200 flex items-center justify-center">
                                                <span className="text-xs">No img</span>
                                            </div>
                                        )}
                                    </ItemMedia>

                                    <ItemContent>
                                        <ItemTitle>{item.name}</ItemTitle>
                                        {item.Tier && (
                                            <span className="text-xs text-gray-500">{item.Tier}</span>
                                        )}
                                        {item.Set && (
                                            <span className="text-xs text-gray-500 ml-2">({item.Set})</span>
                                        )}
                                    </ItemContent>

                                    <ItemContent className="text-right">
                                        <div className="text-xl font-bold">
                                            {item.Stock}
                                        </div>
                                        <ItemDescription className="text-xs">
                                            in stock
                                        </ItemDescription>
                                    </ItemContent>
                                </Item>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
