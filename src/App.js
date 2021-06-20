import React from "react";
import { Typography, TextField, CircularProgress, IconButton, Button, Table, TableBody, TableHead, TableRow, TableCell, Fab } from '@material-ui/core'
import { store } from "./store";
import { action, runInAction, toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { get_loader_for_class_instance } from "./async_loaders";
import { toBase64 } from "./helpers";

export const App = observer(() => {
  return (
    <div style={{
      backgroundColor: '#ddd', width: '100vw', height: '100vh',
      display: 'grid',
      // placeItems: 'center'
    }}>

      <center style={{ display: 'grid', alignItems:'start', margin: '5%', gridTemplateRows: '60px 60px auto' }}>
        <Typography variant='h5'>Pic 2 Pc</Typography>
        <GalleryName />
        <ImageTable />


      </center>
      <ImageUploader />
      <br />
      <br />
      {/* <h3 style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fill, 150px)', gridTemplateRows: 'repeat(auto-fill, 150px)' }}>{store.files
        .map((el, i) => {
          return <div
            key={i}
            style={{
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
            }} src={el} />
            <Typography style={{
              color: 'white',
              fontWeight: 'bold',
              backgroundColor: 'lightslategray',
              gridRow: '3 / 4',
              gridColumn: '1 / 3'
            }}>{i + 1}/{store.files.length}</Typography>
            cp 1/2 x
          </div>
        })}</h3> */}
    </div>

  );
})

const GalleryName = observer(() => {
  return <TextField
    label='Gallery Name'
    fullWidth variant='outlined'
    value={store.gallery_name || ''}
    onChange={action(e => store.gallery_name = e.target.value)}
  />

})

const ImageUploader = observer(() => {
  return <>
    <input
      id='image_uploader'
      accept="image/*" capture="camera"
      // multiple
      hidden
      type='file'
      onChange={action(async e => {
        const files = await Promise.all(Array.from(e.target.files).map(file => toBase64(file)))
        runInAction(() => {
          store.files = [/*...store.files,*/ ...files]
        })
      })}
    />

    <Fab style={{ position: 'absolute', bottom: '5%', right: '10%' }} onClick={() => document.getElementById('image_uploader').click()}>
      <h2>+</h2>
    </Fab>

  </>
})

const ImageTable = observer(() => {
  return <Table>
    <TableHead><TableRow>
      <TableCell>ID</TableCell>
      <TableCell>Picture</TableCell>
      <TableCell>Actions</TableCell>
    </TableRow></TableHead>
    <TableBody>
      {store.files.map((el, i) => <ImageRow key={i} file_index={i} />)}
    </TableBody>
  </Table>

})

const ImageRow = observer(({ file_index }) => {
  return <TableRow>
    <TableCell>hello</TableCell>
    <TableCell>there</TableCell>
    <TableCell>copy delete</TableCell>
  </TableRow>
})