import React from "react";
import { Typography, TextField, CircularProgress, IconButton } from '@material-ui/core'
import { store } from "./store";
import { action, toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { get_loader_for_class_instance } from "./async_loaders";
import { toBase64 } from "./helpers";

export const App = observer(() => {
  return (
    <div style={{
      backgroundColor: 'lightslategray', width: '100vw', height: '100vh',
      display: 'grid', placeItems: 'center'
    }}>
      <div style={{ width: '75vw', height: '90vh', backgroundColor: 'lightgray', borderRadius: '50px', display: 'grid', gap: '10px', padding: '25px' }}>

        <TextField
          disabled={store.files.length > 0}
          style={{ marginTop: '50px' }}
          fullWidth variant='outlined'
          value={store.bin_name}
          onChange={action(e => store.bin_name = e.target.value)}
        />


        {
          get_loader_for_class_instance(store, store.upload) ? <CircularProgress /> :

            <input

              accept="image/*" capture="camera" multiple
              type='file'
              onChange={action(async e => {
                const files = await Promise.all(Array.from(e.target.files).map(file => toBase64(file)))
                store.files = [...store.files, ...files]
              })}
            />

        }

        <h3 style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fill, 150px)', gridTemplateRows: 'repeat(auto-fill, 150px)' }}>{store.files.map((el, i) => {
          return <div style={{
            display: 'grid',
            placeItems: 'center',
            border: '1px dashed gray',
            gridTemplateColumns: '100px 50px',
            gridTemplateRows: '50px 50px 50px'
          }}>
            <IconButton style={{
              width: '50px',
              height: '50px',
              gridRow: '1 / 2',
              gridColumn: '2 / 3',
              backgroundColor: 'pink',
              border: '3px dashed indianred', fontFamily: 'sans-serif', fontWeight: 'bold', color: 'indianred'
            }}>
              x
            </IconButton>
            <img style={{
              gridRow: '1 / 4',
              gridColumn: '1 / 3',
              width: '150px',
              height: '150px',
              objectFit: 'contain'
            }} key={i} src={el} />
            <Typography style={{
              color: 'white',
              fontWeight: 'bold',
              backgroundColor: 'lightslategray',
              gridRow: '3 / 4',
              gridColumn: '1 / 3'
            }}>{i + 1}/{store.files.length}</Typography>
            cp 1/2 x
          </div>
        })}</h3>
      </div>
    </div>
  );
})
