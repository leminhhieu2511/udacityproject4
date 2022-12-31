import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    if (!newTodo.name) {
      return {
        statusCode: 400,
        body: JSON.stringify({message: 'Task Name is empty'})
      }
    }
    const userId = getUserId(event)
    const newItem = await createTodo(userId, newTodo);
    return {
      statusCode: 201,
      body: JSON.stringify({item: newItem})
    }
  }
)

handler.use(httpErrorHandler())
.use(
  cors({
    credentials: true
  })
)
