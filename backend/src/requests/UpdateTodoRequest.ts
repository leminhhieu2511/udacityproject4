/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateTodoRequest {
  name: string
  dueDate: string
  done: boolean
}

export interface UpdateTodoDesRequest {
  description: string
}