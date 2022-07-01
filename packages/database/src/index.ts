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

export const ItemDB = {

  create: (): any => {
    // db.then((value) => { console.log(value) })
  },
  query: () => {
    return dbAccess().then((d) => {
      return d.getAll('item')
    })
  },
  update: (todo: TodoItem) => {
    return dbAccess().then((d) => {
      d.put('item', todo)
    })
  },
  delete: (id: string) => {
    return dbAccess().then((d) => {
      d.delete('item', id)
    })
  }
}
