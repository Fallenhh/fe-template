import { Button, Typography } from '@mui/material'
import { ItemDB } from '@nlpdev/database'
import React from 'react'
import create from 'zustand'

const useStore = create(() => ({}))

export const App: React.FC = function App () {
  // ???
  useStore()
  return (<>
    <Typography variant='h1'>Hello world!</Typography>
    <Button
      onClick={() => {
        // ???
        ItemDB.create()
      }}
    >
      Create
    </Button>
  </>)
}
