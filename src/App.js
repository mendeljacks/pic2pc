import { Fab, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@material-ui/core';
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";
import { toBase64 } from "./helpers";
import { handle_update_gallery_id, store } from "./store";

export const App = observer(() => {
  return (
    <div style={{
      backgroundColor: '#ddd', width: '100vw', height: '100vh',
      display: 'grid',
      // placeItems: 'center'
    }}>

      <center style={{ display: 'grid', alignItems: 'start', margin: '5%', gridTemplateRows: '60px 60px auto' }}>
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
    value={store.gallery_id || ''}
    onChange={handle_update_gallery_id}
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
        const new_pictures = await Promise.all(Array.from(e.target.files).map(file => toBase64(file)))
        store.ws_send(new_pictures.map((base_64) => {
          return {
            gallery_id: store.gallery_id,
            base_64
          }
        }))
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
      {store.pictures.map((el, i) => <ImageRow key={i} picture_index={i} />)}
    </TableBody>
  </Table>

})

const ImageRow = observer(({ picture_index }) => {
  return <TableRow>
    <TableCell>{store.pictures[picture_index].id}</TableCell>
    <TableCell><img style={{ objectFit: 'contain', width: '100px', height: '100px' }} src={store.pictures[picture_index].base_64} alt="upload" /></TableCell>
    <TableCell><button onClick={() => store.copy_image_to_clipboard()}>x copy</button></TableCell>
  </TableRow>
})