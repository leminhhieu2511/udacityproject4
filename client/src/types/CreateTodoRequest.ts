export interface CreateTodoRequest {
  name: string,
  description?: string
  important: boolean
  dueDate: string
}
