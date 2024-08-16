import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from '@aws-amplify/ui-react'
import { Menu, MenuItem, View, Flex } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'
import CreateDish from "./CreateDish";
import { useAuthenticator } from '@aws-amplify/ui-react';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Link
} from "react-router-dom";


const client = generateClient<Schema>();

function Home() {
  const [todos, setTodos] = useState<Array<Schema["Dishes"]["type"]>>([]);
  const { user } = useAuthenticator((context) => [context.user]);

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
    
    <main>
<Flex
  direction="row">
        <View width="4rem">
            <Menu>
                <MenuItem>{user?.username}</MenuItem>
                <MenuItem>
                <Link to="/createdish">Create Dish</Link>                    
                </MenuItem>
                <MenuItem>Option 3</MenuItem>
            </Menu>
        </View>
        <h1>MY DIET ASSISTANT</h1>
        </Flex>

        {user.userId}
        <button onClick={() => createTodo(user?.userId!)}>New Dish</button>
      <ul>
        {todos.map((todo) => (
          <li onClick={() => deleteTodo(todo.owner,todo.compositesortkey)} key={todo.createdAt}>{todo.dishname}</li>
        ))}
      </ul>

      <div>
      </div>
    </main>
  );
}

function App() {
    return(
    <Authenticator hideSignUp>
      {({ signOut, user }) => (

<div>

<Router>
    <Routes>        
        <Route path="/" element={<Home />} />
        <Route path="/createdish" element={<CreateDish />} />
    </Routes>
</Router>

<button onClick={signOut}>Sign out</button>


</div>

      )}
    </Authenticator>);
}

export default App;
