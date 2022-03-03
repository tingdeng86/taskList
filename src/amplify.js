import Amplify, { API } from "aws-amplify"
import awsExports from "./aws-exports"

Amplify.configure(awsExports)
const apiName = 'taskList'

export async function getTasks() {
  const path = '/tasks' 
  const result = await API.get(apiName, path)
  
  return result.tasks
}

export async function getTask(id) {
    const path = `/tasks/${id}`
    const result = await API.get(apiName, path)
    
    return result.task
  }

export async function createTask(title) {
  const path = '/tasks' 
  const result = await API.post(apiName, path, {
    body: { title }
  })
  console.log(result)
  return result.task
}

export async function deleteTask(id) {
    const path = `/tasks/${id}`
    const result = await API.del(apiName, path)
    console.log(result)
    return result
  }

  export async function completedTask(id, completed) {
    const path = `/tasks/${id}`
    
    const result = await API.patch(apiName, path, {
        body: { completed }
    })
    console.log(result)
    return result
  }  
