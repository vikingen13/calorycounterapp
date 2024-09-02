import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from '@aws-amplify/ui-react'
import { Menu,  View, Flex } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { TextField,FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import {
    Link
} from "react-router-dom";
import dayjs from 'dayjs';
import { StorageManager, StorageImage } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';


const client = generateClient<Schema>();
const file = document.getElementById("file");
const upload = document.getElementById("upload");


function CreateDish() {
  const [todos, setTodos] = useState<Array<Schema["Dishes"]["type"]>>([]);
  const [image, setImage] = useState<string>();

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
<Flex direction="column">
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

        <TextField id="dishname" label="dish name" variant="standard" />
        {!image &&
        
        <StorageManager
        acceptedFileTypes={['image/*']}
        path={({ identityId }) => `dishPictures/${identityId}/`}
        maxFileCount={1}
        onUploadSuccess={({ key }) => {
            setImage(key);
        }}
        />
        }

        {image &&
        <StorageImage
            alt="protected image"
            path={() => `${image}`}
        />
        }

<TextField id="calories" label="calories" variant="standard" />
<TextField id="description" label="description" variant="standard" multiline
          rows={4}/>
    <LocalizationProvider dateAdapter={AdapterDayjs}>

<DatePicker label="Basic date picker"   defaultValue={dayjs()}/>
</LocalizationProvider>
<FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={10}          
          label="Time"
        >
          <MenuItem value="">
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
<button onClick={() => createTodo(user?.userId!)}>Add Dish</button>

</Flex>


    </main>
        
    )}
    </Authenticator>
  );
}

export default CreateDish;
