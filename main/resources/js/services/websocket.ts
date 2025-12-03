import { StockData } from '@/types/stock';

export class WebSocketService {
    private ws: WebSocket | null = null;
    private apiKey: string;
    private url: string;
    private onStockUpdate: (data: StockData) => void;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private pingInterval: NodeJS.Timeout | null = null;

    constructor(apiKey: string, onStockUpdate: (data: StockData) => void) {
        this.apiKey = apiKey;
        this.url = 'ws://alpha-v0-lama.3itx.tech';
        this.onStockUpdate = onStockUpdate;
    }

    connect(): void {
        try {
            this.ws = new WebSocket(this.url);

            this.ws.onopen = () => {
                console.log('WebSocket connected');
                this.reconnectAttempts = 0;

                this.ws?.send(JSON.stringify({
                    type: 'auth',
                    apiKey: this.apiKey,
                    filters: ['/api/v1/stock']
                }));

                this.startPing();
            };

            this.ws.onmessage = (event) => {
                const msg = JSON.parse(event.data);
                this.handleMessage(msg);
            };

            this.ws.onclose = () => {
                console.log('WebSocket disconnected');
                this.cleanup();
                this.attemptReconnect();
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.cleanup();
            };
        } catch (error) {
            console.error('Failed to connect to WebSocket:', error);
            this.attemptReconnect();
        }
    }

    private handleMessage(msg: any): void {
        if (msg.type === 'auth_success') {
            console.log('Authenticated with server');
        } else if (msg.type === 'pong') {
            console.log('Received pong');
        } else if (msg.endpoint === '/api/v1/stock') {
            if (msg.response && msg.response.body) {
                try {
                    const stockData = JSON.parse(msg.response.body);
                    this.onStockUpdate(stockData);
                } catch (error) {
                    console.error('Failed to parse stock data:', error);
                }
            }
        }
    }

    private startPing(): void {
        this.pingInterval = setInterval(() => {
            if (this.ws?.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({ type: 'ping' }));
            }
        }, 30000); // Ping every 30 seconds
    }

    private attemptReconnect(): void {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

            console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

            setTimeout(() => {
                this.connect();
            }, delay);
        } else {
            console.error('Max reconnection attempts reached');
        }
    }

    private cleanup(): void {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
    }

    disconnect(): void {
        this.cleanup();
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}
