"use client";

import { setupPixi } from "@/game/initGame";
import {
  USER_JOIN_MUTATION,
  DISCONNECT_USER,
} from "@/graphql/mutations/playground";
import { LIST_PLAYER } from "@/graphql/queries/playground";
import { getMeClient } from "@/utils/getMeClient";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import { useCallback, useEffect, useRef, useState } from "react";
import { UserPlayground } from "./model/playgroundModel";
import {
  USER_JOINED_SUBSCRIPTION,
  USER_DISCONNECT_SUBSCRIPTION,
  USER_MOVE_SUBSCRIPTION,
} from "@/graphql/subscription/playground";
import io, { Socket } from "socket.io-client";

interface UserJoinedSubscriptionData {
  userJoined: UserPlayground;
}
interface Props {
  roomName: string;
}

export default function Game({ roomName }: Props) {
  const user = getMeClient();
  const containerRef = useRef<HTMLDivElement>(null);
  const playerPosRef = useRef<{ x: number; y: number }>({ x: 100, y: 100 });
  const pixiRef = useRef<any>(null);
  const [joinedAppUsers, setJoinedAppUsers] = useState<number[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketReady, setIsSocketReady] = useState(false);
  const [players, setPlayers] = useState<UserPlayground[]>([]);

  const {
    data: dataPlayers,
    loading: dataPlayersLoading,
    error: dataPlayersError,
  } = useQuery<{
    players: UserPlayground[];
  }>(LIST_PLAYER, {
    variables: { roomName },
    onError: (err) => {
      console.error("LIST_PLAYER query error:", err);
    },
  });

  const [userJoinPlayground] = useMutation(USER_JOIN_MUTATION, {
    variables: { roomName },
    errorPolicy: "all",
  });
  const [disconnectUser] = useMutation(DISCONNECT_USER);

  useEffect(() => {
    const socketIo = io("http://localhost:3001", {
      path: "/socket.io/",
      query: { userId: user.id.toString(), roomName },
      transports: ["websocket"],
      withCredentials: true,
    });

    socketIo.on("connect", () => {
      console.log("Socket.IO connected:", socketIo.id);
      setIsSocketReady(true);
      socketIo.emit("join_room", { roomName });
    });

    socketIo.on("player_joined", (data: { userId: number }) => {
      console.log(`Player ${data.userId} joined room ${roomName}`);
    });

    socketIo.on(
      "moved",
      (data: { userId: number; position: { x: number; y: number } }) => {
        setPlayers((prev) =>
          prev?.map((player) =>
            player.userId === data.userId
              ? { ...player, position: data.position }
              : player,
          ),
        );
        pixiRef.current?.updatePlayerPosition(
          data.userId,
          data.position.x,
          data.position.y,
        );
      },
    );

    socketIo.on("player_left", (data: { userId: number }) => {
      setPlayers((prev) => prev?.filter((p) => p.userId !== data.userId));
      pixiRef.current?.removePlayer(data.userId);
    });

    socketIo.on("error", (error: { message: string }) => {
      console.error("Socket error:", error.message);
    });

    socketIo.on("connect_error", (err) => {
      console.error("Socket connect error:", err);
      setIsSocketReady(false);
    });

    socketIo.on("disconnect", () => {
      console.log("Socket.IO disconnected");
      setIsSocketReady(false);
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, [user.id, roomName]);

  useEffect(() => {
    const doJoin = async () => {
      if (!containerRef.current || dataPlayersLoading || dataPlayersError) {
        console.warn(
          "Cannot join: container not ready or players query not complete",
          {
            container: !!containerRef.current,
            loading: dataPlayersLoading,
            error: dataPlayersError,
          },
        );
        return;
      }

      try {
        const res = await userJoinPlayground({
          variables: { userId: user.id },
        });
        if (res?.data?.userJoinPlayground) {
          const joinedUser: UserPlayground = res.data.userJoinPlayground;
          const {
            position: { x, y },
          } = joinedUser;
          pixiRef.current?.updatePlayerPosition(user.id, x, y);

          const playersList = dataPlayers?.players || [];
          if (containerRef.current) {
            const pixiInstance = await setupPixi(
              containerRef.current,
              playersList,
            );
            pixiRef.current = pixiInstance;
            containerRef.current.focus();
          }
        } else {
          console.warn("User join mutation returned no data:", res);
        }
      } catch (err) {
        console.error("User join mutation error:", err);
      }
    };

    doJoin();
  }, [
    userJoinPlayground,
    dataPlayersLoading,
    dataPlayersError,
    dataPlayers?.players,
    user.id,
  ]);

  const move = useCallback(
    (x: number, y: number) => {
      const gameSpace = document.getElementById("game-container");
      const currentPos = playerPosRef.current;
      let dx = currentPos.x + x;
      let dy = currentPos.y + y;

      if (
        gameSpace &&
        dx > 1 &&
        dx < gameSpace.clientWidth &&
        dy > 1 &&
        dy < gameSpace.clientHeight &&
        socket &&
        isSocketReady
      ) {
        const avatarImg =
          players.find((p) => p.userId === user.id)?.avatarImg || "";
        socket.emit("move", {
          userId: user.id,
          position: { x: dx, y: dy },
          avatarImg,
          roomName,
        });
        playerPosRef.current = { x: dx, y: dy };
        pixiRef.current?.updatePlayerPosition(user.id, dx, dy);
      } else {
        console.warn(
          "Cannot move: ",
          !isSocketReady ? "Socket.IO not ready" : "Invalid position",
        );
      }
    },
    [socket, isSocketReady, user.id, players, roomName],
  );

  useEffect(() => {
    const el = containerRef.current;

    if (!el) return;

    const handleKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (["arrowup", "w"].includes(key)) move(0, -10);
      else if (["arrowdown", "s"].includes(key)) move(0, 10);
      else if (["arrowleft", "a"].includes(key)) move(-10, 0);
      else if (["arrowright", "d"].includes(key)) move(10, 0);
    };

    el.addEventListener("keydown", handleKey);

    return () => {
      el.removeEventListener("keydown", handleKey);
    };
  }, [move]);

  useEffect(() => {
    if (dataPlayers?.players) {
      const foundMe = dataPlayers.players.find((p) => p.userId === user.id);
      if (foundMe) {
        playerPosRef.current = {
          x: foundMe.position.x,
          y: foundMe.position.y,
        };
      }
      setPlayers(dataPlayers.players);
    }
  }, [dataPlayers?.players, user.id]);

  useSubscription<UserJoinedSubscriptionData>(USER_JOINED_SUBSCRIPTION, {
    onData: ({ data: { data } }) => {
      if (data && data.userJoined) {
        setJoinedAppUsers((prev) => {
          if (!prev.includes(data.userJoined.userId)) {
            return [...prev, data.userJoined.userId];
          }
          return prev;
        });
        setPlayers((prev) => {
          const newPlayers = prev ? [...prev] : [];
          if (!newPlayers.some((p) => p.userId === data.userJoined.userId)) {
            newPlayers.push(data.userJoined);
            pixiRef.current?.addPlayer(
              data.userJoined.userId.toString(),
              data.userJoined.avatarImg,
              data.userJoined.position.x,
              data.userJoined.position.y,
            );
          }
          return newPlayers;
        });
      }
    },
    onError: (err) => {
      console.error("GraphQL Subscription (User Join) error:", err);
    },
  });

  useSubscription(USER_DISCONNECT_SUBSCRIPTION, {
    onData: ({ data: { data } }) => {
      if (data && data.userDisconnected) {
        const disconnectedUserId = data.userDisconnected.userId;
        setPlayers((prevPlayers) =>
          prevPlayers?.filter((p) => p.userId !== disconnectedUserId),
        );
        pixiRef.current?.removePlayer(disconnectedUserId);
      }
    },
    onError: (err) => {
      console.error("GraphQL Subscription (User Disconnect) error:", err);
    },
  });

  useSubscription(USER_MOVE_SUBSCRIPTION, {
    onData: ({ data }) => {
      const movedPlayer = data.data?.userMoved;
      if (movedPlayer) {
        setPlayers((prev) =>
          prev?.map((player) =>
            player.userId === movedPlayer.userId
              ? { ...player, position: movedPlayer.position }
              : player,
          ),
        );

        if (movedPlayer.userId === user.id) {
          playerPosRef.current = {
            x: movedPlayer.position.x,
            y: movedPlayer.position.y,
          };
        }

        pixiRef.current?.updatePlayerPosition(
          movedPlayer.userId,
          movedPlayer.position.x,
          movedPlayer.position.y,
        );
      }
    },
    onError: (err) => {
      console.error("GraphQL Subscription (User Move) error:", err);
    },
  });

  return (
    <div
      tabIndex={1}
      ref={containerRef}
      className="w-[calc(100vw-6rem)] h-[calc(100vh-4rem)] rounded-2xl ring-offset-0 ring-0 outline-0"
      id="game-container"
    ></div>
  );
}
