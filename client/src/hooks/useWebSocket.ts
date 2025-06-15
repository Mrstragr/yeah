import { useEffect, useRef, useState } from 'react';

interface WebSocketMessage {
  type: string;
  data?: any;
  timestamp: string;
}

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [liveStats, setLiveStats] = useState<any>(null);
  const [gameResults, setGameResults] = useState<any>({});
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const connect = () => {
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        setIsConnected(true);
        console.log('Connected to WebSocket');
        
        // Request initial live stats
        wsRef.current?.send(JSON.stringify({
          type: 'get_live_stats'
        }));
      };
      
      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          switch (message.type) {
            case 'connected':
              console.log('WebSocket connection confirmed');
              break;
              
            case 'live_stats':
              setLiveStats(message.data);
              break;
              
            case 'live_update':
              if (message.data) {
                setLiveStats(message.data.stats);
                setGameResults({
                  winGo: message.data.winGoResult,
                  k3: message.data.k3Result
                });
              }
              break;
              
            case 'game_result':
              setGameResults(prev => ({
                ...prev,
                [message.data.gameType]: message.data.result
              }));
              break;
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      };
      
      wsRef.current.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket disconnected, attempting to reconnect...');
        setTimeout(connect, 3000); // Reconnect after 3 seconds
      };
      
      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };
    
    connect();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const subscribeToGame = (gameId: number) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'subscribe_game',
        gameId
      }));
    }
  };

  const sendMessage = (message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  return {
    isConnected,
    liveStats,
    gameResults,
    subscribeToGame,
    sendMessage
  };
};