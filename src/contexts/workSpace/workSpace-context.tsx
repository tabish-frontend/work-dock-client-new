import { createContext } from "react";
import { workSpaceInitialValues } from "src/formik";
import { WorkSpace, WorkSpaceBoard } from "src/types";

export interface State {
  WorkSpaces: WorkSpace[];
}

export const initialState: State = {
  WorkSpaces: [],
};

export interface WorkSpaceContextType extends State {
  getCurrentWorkSpace: (slug: string | string[] | undefined) => any;
  handleAddWorkSpace: (data: WorkSpace) => void;
  handleUpdateWorkSpace: (data: {
    _id: string;
    name: string;
    members: string[];
  }) => void;
  handleDeleteWorkSpace: (_id: string) => void;
  getCurrentBoard: (
    workspace_slug: string | string[] | undefined,
    board_slug: string | string[] | undefined
  ) => any;
  handleAddBoard: (data: WorkSpaceBoard) => void;
  handleUpdateBoard: (board_id: string, data: WorkSpaceBoard) => void;
  handleDeletBoard: (board_id: string) => void;
  handleAddColumn: (data: { name: string; board: string }) => void;
  handleUpdateColumn: (column_id: string, data: { name: string }) => void;
  handleDeleteColumn: (column_id: string) => void;
  handleMoveColumn: (data: {
    board_id: string;
    column_id: string;
    index: number;
  }) => void;
  handleAddTask: (data: {
    title: string;
    board: string;
    column: string;
  }) => void;
  handleDeleteTask: (_id: string) => void;
}

export const WorkSpaceContext = createContext<WorkSpaceContextType>({
  ...initialState,
  getCurrentWorkSpace: (slug) => initialState.WorkSpaces,
  handleUpdateWorkSpace: () => {},
  handleDeleteWorkSpace: () => {},
  handleAddWorkSpace: () => {},
  getCurrentBoard: () => {},
  handleAddBoard: () => {},
  handleUpdateBoard: () => {},
  handleDeletBoard: () => {},
  handleAddColumn: () => {},
  handleUpdateColumn: () => {},
  handleDeleteColumn: () => {},
  handleMoveColumn: () => {},
  handleAddTask: () => {},
  handleDeleteTask: () => {},
});
