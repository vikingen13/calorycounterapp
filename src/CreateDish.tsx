import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from '@aws-amplify/ui-react'
import { Flex } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { TextField,FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';
import { StorageManager, StorageImage } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import Header from './components/Header'



const client = generateClient<Schema>();

function CreateDish() {
  const [image, setImage] = useState<string>();

  useEffect(() => {
  }, []);

  function createTodo(userId:string) {
    client.models.Dishes.create({ owner: userId, compositesortkey:generateCompositeSortKey('20240816', 'LUNCH'), dishname: window.prompt("Todo content") });
  }
    

  function generateCompositeSortKey(mealdate:string, mealType:string) {
    return mealdate + '#' + mealType +'#' + Date.now();
  }

  return (
    
    <Authenticator hideSignUp>
      {({ user }) => (
    <main>

<Flex
  direction="row">
        <Header/>
        </Flex>
        <Flex direction="column" marginLeft="10%" marginRight="10%">
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
<Flex direction="row" marginLeft="20%" marginRight="20%">
        {image &&
        <StorageImage
            alt="protected image"
            path={() => `${image}`}
        />
        }
</Flex>
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
