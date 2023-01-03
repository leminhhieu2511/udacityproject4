import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentS3StorageUtils } from '../helpers/attachmentS3StorageUtils'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'

const logger = createLogger('todos')

const todosAccess = new TodosAccess()
const attachmentUtil = new AttachmentS3StorageUtils()

export async function getTodos(userId: string) {
  return await todosAccess.getAllTodos(userId)
}

export async function createTodo(
  userId: string,
  createTodoRequest: CreateTodoRequest
): Promise<TodoItem> {
  const todoId = uuid.v4()
  const s3BucketName = process.env.ATTACHMENT_S3_BUCKET
  const newItem: TodoItem = {
    userId,
    todoId,
    createdAt: new Date().toISOString(),
    done: false,
    attachmentUrl:  `https://${s3BucketName}.s3.amazonaws.com/${todoId}`, 
    ...createTodoRequest
  }
  await todosAccess.createTodo(newItem)
  return newItem
}

async function checkTodo(userId: string, todoId: string) {
  const existItem = await todosAccess.getTodoItem(userId, todoId)
  if (!existItem) {
    throw new createError.NotFound(`Todo with id: ${todoId} not found`)
  }

  if (existItem.userId !== userId) {
    throw new createError.BadRequest('User not authorized to update item')
  }
}

export async function updateTodo(
  userId: string,
  todoId: string,
  updateRequest: UpdateTodoRequest
) {
  await checkTodo(userId, todoId)

  todosAccess.updateTodoItem(userId, todoId, updateRequest)
}

export async function deleteTodo(userId: string, todoId: string) {
  await checkTodo(userId, todoId)

  todosAccess.deleteTodoItem(userId, todoId)
}

export async function updateAttachmentUrl(
  userId: string,
  todoId: string,
  attachmentId: string,
  description?: string
) {
  await checkTodo(userId, todoId)

  const url = await attachmentUtil.getAttachmentUrl(attachmentId)

  await todosAccess.updateAttachmentUrl(userId, todoId, url, description)
}

export async function generateAttachmentUrl(id: string): Promise<string> {
  return await attachmentUtil.getUploadUrl(id)
}
