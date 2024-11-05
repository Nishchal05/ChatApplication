import React from 'react'
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
const Loader = () => {
  return (
    <div> <Box sx={{ width: 260}}>
    <Skeleton animation="wave" style={{backgroundColor:'GrayText', height:'60px'}}/>
    <Skeleton animation="wave" style={{backgroundColor:'GrayText' , height:'60px'}}/>
    <Skeleton animation="wave" style={{backgroundColor:'GrayText' , height:'60px'}}/>
    <Skeleton animation="wave" style={{backgroundColor:'GrayText' , height:'60px'}}/>
    <Skeleton animation="wave" style={{backgroundColor:'GrayText' , height:'60px'}}/>
    <Skeleton animation="wave" style={{backgroundColor:'GrayText' , height:'60px'}}/>
    <Skeleton animation="wave" style={{backgroundColor:'GrayText' , height:'60px'}}/>
    <Skeleton animation="wave" style={{backgroundColor:'GrayText' , height:'60px'}}/>
    <Skeleton animation="wave" style={{backgroundColor:'GrayText' , height:'60px'}}/>
    <Skeleton animation="wave" style={{backgroundColor:'GrayText' , height:'60px'}}/>
  </Box></div>
  )
}

export default Loader