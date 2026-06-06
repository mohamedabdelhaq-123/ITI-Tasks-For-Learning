// export type statusType = 'todo' | 'in-progress' | 'done';
export enum statusType {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
}

export type todoType = {
  id: number;
  task: string;
  status: statusType;
};

export interface UpdateTodoDto {
  id: number;
  task?: string;
  status?: statusType;
}
