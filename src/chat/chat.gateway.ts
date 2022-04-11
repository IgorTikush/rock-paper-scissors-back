import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { getWinner } from './utils/getWinner';
const state: any = {};

@WebSocketGateway( { cors: true })
export class ChatGateway {
  @WebSocketServer()
  server;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    this.server.emit('message', message)
  }

  @SubscribeMessage('checkRooms')
  creatRoom(socket: Socket): any {
    const roomName: string = 'game' + Math.floor(Math.random() * 1000);
    const rooms: string[] = this.server.sockets.adapter.rooms;


    const gameRooms: string[] = [...rooms].map(([roomName]) => roomName).filter(roomName => roomName.includes('game'));
    const availableGameRooms: string[] = gameRooms.filter(room => this.server.sockets.adapter.rooms.get(room).size === 1);

    if (availableGameRooms.length) {
      const [roomName]: string[] = availableGameRooms
      socket.join(roomName);
      state[roomName][socket.id] = '';
      this.server.to(roomName).emit('gameReady', { room: roomName })
    } else {
      socket.join(roomName);
      state[roomName] = {
        [socket.id]: '',
      };
    }
  }

  @SubscribeMessage('makeMove')
  makeMove(socket: Socket, data): any {
    const roomName = data.roomName;
    state[roomName] = {
      ...state[roomName],
      [socket.id]: data.move,
    };
    const isBothPlayersAnswered: boolean
      = Object.keys(state[roomName]).length === 2 && Object.values(state[roomName]).every(Boolean);
    if (!isBothPlayersAnswered) {
      return;
    }

    const roomEntries: [string, string][] = Object.entries(state[roomName]);
    const [firstPlayer, secondPlayer]: [string, string][] = roomEntries;
    const gameResult = getWinner(firstPlayer, secondPlayer);

    this.server.to(roomName).emit('gameResult', { status: gameResult.status, winner: gameResult.winner });
  }
}
