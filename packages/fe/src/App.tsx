import { Button, Container, List, ListItem, ListItemText, TextField, Typography } from '@mui/material'
import { ItemDB, TodoItem } from '@nlpdev/database'
import React, { useState } from 'react'
import create from 'zustand'

interface TodoState {
  todos: TodoItem[]
  addTodo: (name: string, description: string) => void
  addTodoId: (todo: TodoItem) => void
  removeTodo: (id: string) => void
}

ItemDB.create()

const useStore = create<TodoState>((set) => ({
  // initial state
  todos: [],
  // methods for manipulating state
  addTodo: (name: string, description: string) => {
    const todo = {
      id: Date.now().toString(),
      name,
      description
    } as TodoItem

    set((state) => ({
      todos: [...state.todos, todo]
    }))

    ItemDB.update(todo)
  },

  addTodoId: (todo: TodoItem) => {
    set((state) =>
      state.todos.indexOf(todo)
        ? state
        : {
            todos: [...state.todos, todo]
          }
    )
  },

  removeTodo: (id) => {
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id)
    }))
    ItemDB.delete(id)
  }
}))

export const App: React.FC = function App () {
  const [todoName, setTodoName] = useState('')
  const [todoText, setTodoText] = useState('')
  const { addTodo, addTodoId, removeTodo, todos } = useStore()

  return (
    <Container maxWidth='xs'>
      <Typography variant='h2'>To-Do</Typography>
      <Button
        fullWidth
        variant='outlined'
        color='primary'
        onClick={() => {
          ItemDB.query().then((result) => {
            result.forEach((item) => {
              addTodoId(item)
            })
          })
        }}>
        Connect
      </Button>
      <TextField
        label='Todo Name'
        required
        variant='outlined'
        fullWidth
        onChange={(e) => setTodoName(e.target.value)}
        value={todoName}
      />
      <TextField
        label='Todo Description'
        required
        variant='outlined'
        fullWidth
        onChange={(e) => setTodoText(e.target.value)}
        value={todoText}
      />
      <Button
        fullWidth
        variant='outlined'
        color='primary'
        onClick={() => {
          if (todoName.length) {
            addTodo(todoName, todoText)
            setTodoName('')
            setTodoText('')
          }
        }}>
        Add Item
      </Button>
      <List>
        {todos.map((todo) => (
          <ListItem key={todo.id}>
            <Button
              variant='outlined'
              color='secondary'
              onClick={() => {
                removeTodo(todo.id)
              }}>
              Delete
            </Button>
            <ListItemText key={todo.id} primary={todo.name} secondary={todo.description}>
              {todo.name}
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Container>
  )
}
