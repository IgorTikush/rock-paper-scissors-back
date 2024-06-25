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
import { WebAppDataGuard } from '../guards/webAppDataGuard';
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

  @SubscribeMessage('checkRooms')
  createRoom(@ConnectedSocket() socket: Socket, @Req() { user }: { user: any }): any {
    console.log('checkRooms');
    const roomName: string = 'game-' + randomUUID();

    const rooms: string[] = this.server.sockets.adapter.rooms;

    const gameRooms: string[] = [...rooms]
      .map(([roomName]) => roomName)
      .filter((roomName) => roomName.includes('game'));

    const availableGameRooms: string[] = gameRooms.filter(
      (room) => this.server.sockets.adapter.rooms.get(room).size === 1,
    );

    if (availableGameRooms.length) {
      const [roomName]: string[] = availableGameRooms;
      socket.join(roomName);
      state[roomName][socket.id] = {
        userTgId: user.id,
      };
      this.server.to(roomName).emit('gameReady', { room: roomName });
    } else {
      socket.join(roomName);
      state[roomName] = {
        [socket.id]: {
          userTgId: user.id,
        },
      };
    }
  }

  @SubscribeMessage('makeMove')
  makeMove(@ConnectedSocket() socket: Socket, @MessageBody() data: any, @Req() { user }: { user: IUser }): any {
    const roomName = data.roomName;
    console.log('roomname', data)
    state[roomName][socket.id].move = data.move;

    const isBothPlayersAnswered: boolean =
      Object.keys(state[roomName]).length === 2 &&
      Object.values(state[roomName]).every((playerData: any) => !!playerData.move);
    if (!isBothPlayersAnswered) {
      console.log(state)
      console.log('return');
      return;
    }

    const roomEntries: [string, string][] = Object.entries(state[roomName]);
    const [firstPlayer, secondPlayer]: any = roomEntries;
    const gameResult = getWinner(firstPlayer, secondPlayer);
    console.log('result', gameResult);
    const otherPlayerSocketId = Object.keys(state[roomName]).find(
      (key) => key !== socket.id,
    )
    // const otherPlayerTgId = state[roomName][otherPlayerSocketId].userTgId

    this.server.to(socket.id).emit('gameResult', {
      status: gameResult.status,
      winner: gameResult.winner,
    });


    if (gameResult.status === 'win') {
      console.log('win', state[roomName][gameResult.winner]);
      this.userService.updateBalance(state[roomName][gameResult.winner].userTgId, 0.1)
      this.userService.updateBalance(state[roomName][gameResult.loser].userTgId, -0.1)
    }

    this.server.to(otherPlayerSocketId).emit('gameResult', {
      status: gameResult.status,
      winner: gameResult.winner,
    });

    delete state[roomName]
  }
}
