import { DBSchema, openDB } from 'idb'

import { createDBAccess } from './util'

export type TodoItem = {
  id: string
  name: string
  description: string
}

export interface TodoDBSchema extends DBSchema {
  item: {
    key: TodoItem['id']
    value: TodoItem
  }
}

const dbAccess = createDBAccess<TodoDBSchema>(
  () => openDB('todo-db', 1, {
    upgrade (database) {
      database.createObjectStore('item', {
        keyPath: 'id'
      })
    }
  }))

// ???
export const ItemDB = {
  create: (...args: any[]) => {},
  query: (...args: any[]) => {},
  update: (...args: any[]) => {},
  delete: (...args: any[]) => {}
}
