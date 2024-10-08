import type { Message, Participant, Thread } from "src/types/chat";

import Axios from "src/config/axios";

type GetThreadsRequest = object;

type GetThreadsResponse = Promise<Thread[]>;

type GetThreadRequest = {
  threadKey: string;
  populateFields?: string[];
};

type GetThreadResponse = Promise<Thread | null>;

type MarkThreadAsSeenRequest = {
  threadId: string;
};

type MarkThreadAsSeenResponse = Promise<true>;

type GetParticipantsRequest = {
  threadKey: string;
};

type GetParticipantsResponse = Promise<Participant[]>;

type AddMessageRequest = {
  threadId?: string;
  recipientIds?: string[];
  body: string;
};

type AddMessageResponse = Promise<{
  message: Message;
  threadId: string;
}>;

class ChatApi {
  async getThreads(request: GetThreadsRequest = {}): GetThreadsResponse {
    const response = await Axios.get(`/messages`);

    return response.data;
  }

  async getThread(request: GetThreadRequest): GetThreadResponse {
    const { threadKey, populateFields = ["participants", "messages"] } =
      request; // Add populateFields to the request object

    // Send the fields to be populated as query parameters
    const response = await Axios.get(
      `/messages/thread/${threadKey}?populate=${populateFields.join(",")}`
    );

    return response.data;
  }

  async getParticipants(
    request: GetParticipantsRequest
  ): GetParticipantsResponse {
    const { threadKey } = request;

    const response = await Axios.get(`/messages/${threadKey}`);

    return response.data;
  }

  async addMessage(request: AddMessageRequest): AddMessageResponse {
    const response = await Axios.post(`/messages/send`, request);

    return response.data;
  }

  markThreadAsSeen(request: MarkThreadAsSeenRequest): MarkThreadAsSeenResponse {
    const { threadId } = request;

    return new Promise((resolve, reject) => {
      // try {
      //   const thread = threads.find((thread) => thread.id === threadId);
      //   if (thread) {
      //     thread.unreadCount = 0;
      //   }
      //   resolve(true);
      // } catch (err) {
      //   reject(new Error("Internal server error"));
      // }
    });
  }
}

export const chatApi = new ChatApi();
