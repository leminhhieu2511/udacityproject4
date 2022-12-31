export interface Todo {
  todoId: string
  createdAt: string
  name: string
  description?: string
  important?: boolean,
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
