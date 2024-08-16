import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from '@aws-amplify/ui-react'
import { Menu, MenuItem, View, Flex } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'
import {
    BrowserRouter as Router,
    Route,
    Routes
} from "react-router-dom";


const client = generateClient<Schema>();

function CreateDish() {
  const [todos, setTodos] = useState<Array<Schema["Dishes"]["type"]>>([]);

  useEffect(() => {
    client.models.Dishes.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo(userId:string) {
    client.models.Dishes.create({ owner: userId, compositesortkey:generateCompositeSortKey('20240816', 'LUNCH'), dishname: window.prompt("Todo content") });
  }

    
  function deleteTodo(owner:string, compositesortkey: string) {
    client.models.Dishes.delete({ owner, compositesortkey })
  }

  function generateCompositeSortKey(mealdate:string, mealType:string) {
    return mealdate + '#' + mealType +'#' + Date.now();
  }

  return (
    
    <Authenticator hideSignUp>
      {({ signOut, user }) => (
    <main>

        <Flex
  direction="row">
        <View width="4rem">
            <Menu>
                <MenuItem>Option 1</MenuItem>
                <MenuItem>Option 2</MenuItem>
                <MenuItem>Option 3</MenuItem>
            </Menu>
        </View>
        <h1>MY DIET ASSISTANT</h1>
        </Flex>
        {user?.userId}
        {user?.signInDetails?.loginId}
        <button onClick={() => createTodo(user?.userId!)}>New Dish</button>
      <ul>
        {todos.map((todo) => (
          <li onClick={() => deleteTodo(todo.owner,todo.compositesortkey)} key={todo.createdAt}>{todo.dishname}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
      <button onClick={signOut}>Sign out</button>
    </main>
        
    )}
    </Authenticator>
  );
}

export default CreateDish;
