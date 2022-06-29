import { Button, Container, List, ListItem, ListItemText, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import create from 'zustand'

interface Todo {
  id: string
  name: string
  description: string
}

interface TodoState {
  todos: Todo[]
  addTodo: (name: string, description: string) => void
  removeTodo: (id: string) => void
}

const useStore = create<TodoState>((set) => ({
  // initial state
  todos: [],
  // methods for manipulating state
  addTodo: (name: string, description: string) => {
    set((state) => ({
      todos: [
        ...state.todos,
        {
          id: Date.now().toString(),
          name,
          description
        } as Todo
      ]
    }))
  },
  removeTodo: (id) => {
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id)
    }))
  }
}))

export const App: React.FC = function App () {
  const [todoName, setTodoName] = useState('')
  const [todoText, setTodoText] = useState('')
  const { addTodo, removeTodo, todos } = useStore()
  return (
    <Container maxWidth='xs'>
      <Typography variant='h2'>To-Do</Typography>
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
          if (todoText.length) {
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
