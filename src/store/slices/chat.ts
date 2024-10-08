import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { Contact, Message, Thread } from "src/types";
import { objFromArray } from "src/utils/obj-from-array";

interface ChatState {
  contacts: {
    byId: Record<string, Contact[]>;
    allIds: string[];
  };
  currentThreadId?: string;
  threads: {
    byId: Record<string, Thread>;
    allIds: string[];
  };
}

type GetContactsAction = PayloadAction<Contact[]>;

type GetThreadsAction = PayloadAction<Thread[]>;

type GetThreadAction = PayloadAction<Thread | null>;

type MarkThreadAsSeenAction = PayloadAction<string>;

type SetCurrentThreadAction = PayloadAction<string | undefined>;

type AddMessageAction = PayloadAction<{ message: Message; threadId: string }>;

const initialState: ChatState = {
  contacts: {
    byId: {},
    allIds: [],
  },
  currentThreadId: undefined,
  threads: {
    byId: {},
    allIds: [],
  },
};

const reducers = {
  getContacts(state: ChatState, action: GetContactsAction): void {
    const contacts = action.payload;

    state.contacts.byId = objFromArray(contacts);
    state.contacts.allIds = Object.keys(state.contacts.byId);
  },
  getThreads(state: ChatState, action: GetThreadsAction): void {
    const threads = action.payload;

    state.threads.byId = objFromArray(threads);
    state.threads.allIds = Object.keys(state.threads.byId);
  },
  getThread(state: ChatState, action: GetThreadAction): void {
    const thread = action.payload;

    if (thread) {
      state.threads.byId[thread._id!] = thread;

      if (!state.threads.allIds.includes(thread._id!)) {
        state.threads.allIds.unshift(thread._id!);
      }
    }
  },
  markThreadAsSeen(state: ChatState, action: MarkThreadAsSeenAction): void {
    const threadId = action.payload;
    const thread = state.threads.byId[threadId];

    if (thread) {
      thread.unreadCount = 0;
    }
  },
  setCurrentThread(state: ChatState, action: SetCurrentThreadAction): void {
    state.currentThreadId = action.payload;
  },
  addMessage(state: ChatState, action: AddMessageAction): void {
    const { threadId, message } = action.payload;
    const thread = state.threads.byId[threadId];

    if (thread) {
      thread.messages.push(message);

      // Move the threadId to the top of the allIds array
      const index = state.threads.allIds.indexOf(threadId);
      if (index !== -1) {
        state.threads.allIds.splice(index, 1); // Remove the threadId from its current position
      }
      state.threads.allIds.unshift(threadId); // Add threadId to the top
    }
  },
};

export const slice = createSlice({
  name: "chat",
  initialState,
  reducers,
});

export const { reducer } = slice;
