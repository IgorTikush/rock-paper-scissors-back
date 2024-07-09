import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { getWinner } from './utils/getWinner';
import { randomUUID } from 'crypto';
import { Req, UseGuards } from '@nestjs/common';
import { IUser } from '../user/interfaces/user.interface';
import { UserService } from '../user/user.service';
import { WebSocketAppDataGuard } from '../guards/webSocketGuard';
const state: any = {};

@UseGuards(WebSocketAppDataGuard)
@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server;

  constructor(
    private readonly userService: UserService
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    Object.entries(state).forEach(([roomName, roomInfo]) => {
      if (roomInfo[client.id]) {
        delete state[roomName];
      }
    });
  }

  @SubscribeMessage('checkRooms')
  createRoom(@ConnectedSocket() socket: Socket, @MessageBody() data: any, @Req() { user }: { user: any }): any {
    console.log('checkRooms');
    const roomName: string = 'game-' + randomUUID();

    const rooms = Object.keys(state);
    console.log(rooms);
    const availableGameRooms = [];
    for (let room of rooms) {
      console.log(room, state[room]);
      if (!data.wallet && state[room].free) {
        console.log('rooms', state[room]);
        availableGameRooms.push(room);
      }

      if (data.wallet && user.balance && !state[room].free) {
        availableGameRooms.push(room);
      }
    } 

    if (availableGameRooms.length) {
      const [roomName]: string[] = availableGameRooms;
      const [otherPlayerSocketId]= Object.keys(state[roomName].members);
      state[roomName].members[socket.id] = {
        userTgId: user.id,
      };
      // delete state[roomName].free;
      this.server.to(socket.id).emit('gameReady', { room: roomName });
      this.server.to(otherPlayerSocketId).emit('gameReady', { room: roomName });
    } else {
      state[roomName] = {
        members: {
          [socket.id]: {
            userTgId: user.id,
          },
        }
      };
      console.log('state', state);
      state[roomName].free = !data.wallet;
    }
  }

  @SubscribeMessage('makeMove')
  makeMove(@ConnectedSocket() socket: Socket, @MessageBody() data: any, @Req() { user }: { user: IUser }): any {
    const roomName = data.roomName;
    console.log('roomname', data)
    state[roomName].members[socket.id].move = data.move;
    console.log(state[roomName]);
    const isBothPlayersAnswered: boolean =
      Object.keys(state[roomName].members).length === 2 &&
      Object.values(state[roomName].members).every((playerData: any) => !!playerData.move);
    if (!isBothPlayersAnswered) {
      return;
    }

    const roomEntries: [string, string][] = Object.entries(state[roomName].members);
    const [firstPlayer, secondPlayer]: any = roomEntries;
    const gameResult = getWinner(firstPlayer, secondPlayer);
    console.log('result', gameResult);
    const otherPlayerSocketId = Object.keys(state[roomName].members).find(
      (key) => key !== socket.id,
    )

    this.server.to(socket.id).emit('gameResult', {
      status: gameResult.status,
      winner: gameResult.winner,
    });


    if (gameResult.status === 'win' && !state[roomName].free) {
      console.log('win', state[roomName][gameResult.winner]);
      this.userService.updateBalance(state[roomName].members[gameResult.winner].userTgId, 0.1)
      this.userService.updateBalance(state[roomName].members[gameResult.loser].userTgId, -0.1)
    }

    this.server.to(otherPlayerSocketId).emit('gameResult', {
      status: gameResult.status,
      winner: gameResult.winner,
    });

    delete state[roomName]
  }
}
