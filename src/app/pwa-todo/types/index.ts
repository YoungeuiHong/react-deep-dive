export interface ToDo {
  id: number;
  task: string;
  due: string;
  done: boolean;
}

export interface CreateToDoInput {
  task: string;
  due: string;
}

export interface UpdateToDoInput {
  id: number;
  done: boolean;
}

export interface PushSubscription {
  id: number;
  subscription: string;
}
