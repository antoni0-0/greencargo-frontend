import { io, Socket } from 'socket.io-client';
import { WebSocketUpdate, WebSocketNotification } from '../types/misEnvios';

export class EnvioWebSocket {
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private token: string;
  private subscribers: Map<number, (update: WebSocketUpdate) => void> = new Map();
  private notificationCallback?: (notification: WebSocketNotification) => void;

  constructor(token: string) {
    this.token = token;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = io('http://localhost:3000', {
        auth: {
          token: `Bearer ${this.token}`
        },
        transports: ['websocket', 'polling']
      });

      this.setupEventListeners();

      this.socket.on('connect', () => {
        console.log('Conectado al WebSocket');
        this.isConnected = true;
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('Error de conexión WebSocket:', error.message);
        this.isConnected = false;
        reject(error);
      });
    });
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('disconnect', () => {
      console.log('Desconectado del WebSocket');
      this.isConnected = false;
    });

    this.socket.on('envio_status_update', (update: WebSocketUpdate) => {
      console.log('Actualización de envío recibida:', update);
      this.handleEnvioUpdate(update);
    });

    this.socket.on('notification', (notification: WebSocketNotification) => {
      console.log('Notificación recibida:', notification);
      this.handleNotification(notification);
    });

    this.socket.on('reconnect', () => {
      console.log('Reconectado al WebSocket');
      this.isConnected = true;
      this.resubscribeToAllEnvios();
    });
  }

  subscribeToEnvio(envioId: number, callback: (update: WebSocketUpdate) => void): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('subscribe_envio', envioId);
      this.subscribers.set(envioId, callback);
      console.log(`Suscrito a actualizaciones del envío ${envioId}`);
    }
  }

  unsubscribeFromEnvio(envioId: number): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('unsubscribe_envio', envioId);
      this.subscribers.delete(envioId);
      console.log(`Desuscrito de actualizaciones del envío ${envioId}`);
    }
  }

  private resubscribeToAllEnvios(): void {
    this.subscribers.forEach((_, envioId) => {
      if (this.socket && this.isConnected) {
        this.socket.emit('subscribe_envio', envioId);
      }
    });
  }

  private handleEnvioUpdate(update: WebSocketUpdate): void {
    const callback = this.subscribers.get(update.envioId);
    if (callback) {
      callback(update);
    }
    
    if (this.notificationCallback) {
      this.notificationCallback({
        tipo: 'envio_update',
        titulo: 'Actualización de Envío',
        mensaje: update.mensaje,
        envioId: update.envioId,
        timestamp: new Date().toISOString()
      });
    }
  }

  private handleNotification(notification: WebSocketNotification): void {
    if (this.notificationCallback) {
      this.notificationCallback(notification);
    }
  }

  setNotificationCallback(callback: (notification: WebSocketNotification) => void): void {
    this.notificationCallback = callback;
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  getSocketId(): string | undefined {
    return this.socket?.id;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.subscribers.clear();
      console.log('Desconectado del WebSocket');
    }
  }

  static async requestNotificationPermission(): Promise<boolean> {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        return true;
      } else if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
    }
    return false;
  }

  static showBrowserNotification(title: string, message: string, icon?: string): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: icon || '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'greencargo-notification'
      });
    }
  }
}

let globalWebSocket: EnvioWebSocket | null = null;

export const getWebSocketInstance = (token?: string): EnvioWebSocket | null => {
  if (!globalWebSocket && token) {
    globalWebSocket = new EnvioWebSocket(token);
  }
  return globalWebSocket;
};

export const clearWebSocketInstance = (): void => {
  if (globalWebSocket) {
    globalWebSocket.disconnect();
    globalWebSocket = null;
  }
};
