import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from '@aws-amplify/ui-react'
import { Flex } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'
import CreateDish from "./CreateDish";
import { useAuthenticator } from '@aws-amplify/ui-react';
import {
    BrowserRouter as Router,
    Route,
    Routes    
} from "react-router-dom";
import { BottomNavigation, BottomNavigationAction} from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Header from './components/Header'




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
      <Header />
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
      {({ signOut }) => (

<div>

<Router>
    <Routes>        
        <Route path="/" element={<Home />} />
        <Route path="/createdish" element={<CreateDish />} />
    </Routes>
</Router>

<BottomNavigation
  showLabels
  value={"Recents"}
  onChange={(event, newValue) => {
    //setValue(newValue);
  }}
>
  <BottomNavigationAction label="Profile" icon={<RestoreIcon />} />
  <BottomNavigationAction label="Add Dish" icon={<FavoriteIcon />} href="/createdish" />
  <BottomNavigationAction label="Sign Out" icon={<LocationOnIcon />} onClick={signOut}/>
</BottomNavigation>
</div>

      )}
    </Authenticator>);
}

export default App;
