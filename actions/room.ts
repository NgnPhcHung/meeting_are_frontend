"use server";

import { CreateRoomDto } from "@/dtos/createRoomDto";
import { InviteToRoomDto } from "@/dtos/inviteToRoomDto";
import { UpdateRoomDto } from "@/dtos/updateRoomDto";
import {
  CREATE_ROOM,
  INVITE_TO_ROOM,
  UPDATE_ROOM,
} from "@/graphql/mutations/room";
import { getClient } from "@/libs/apolloClient";
import { RoomMutation } from "@/types/room";

export const createRoom = async (body: CreateRoomDto) => {
  try {
    const { data } = await getClient().mutate<RoomMutation>({
      mutation: CREATE_ROOM,
      variables: { input: body },
    });

    if (!data || !data.createRoom) {
      return {
        success: false,
        message: "Failed to create a room",
      };
    }

    return { success: true, message: "Create room successful", data };
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const updateRoom = async (body: UpdateRoomDto) => {
  try {
    const { data } = await getClient().mutate<RoomMutation>({
      mutation: UPDATE_ROOM,
      variables: { input: body },
    });

    if (!data || !data.updateRoom) {
      return {
        success: false,
        message: "Failed to update a room",
      };
    }
    return { success: true, message: "Room successful updated", data };
  } catch (error) {
    console.error("Update room error:", error);
    throw error;
  }
};

export const inviteToRoom = async (body: InviteToRoomDto) => {
  try {
    const { data } = await getClient().mutate<RoomMutation>({
      mutation: INVITE_TO_ROOM,
      variables: { input: body },
    });

    if (!data || !data.inviteToRoom) {
      return {
        success: false,
        message: "Failed to invite to room",
      };
    }
    return { success: true, message: "Invitation has been sent", data };
  } catch (error) {
    throw error;
  }
};
