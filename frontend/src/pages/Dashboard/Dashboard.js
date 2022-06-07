import React, { useEffect, useState } from 'react';
import { getQuestionService } from '../../config/QuestionService'
import { useNavigate } from 'react-router'
import Navvbar from '../Navvbar/Navvbar';

import './Home.css'
import { Grid, Paper, Box, Card, CardActions, CardContent, Typography, Container, Modal, Button } from '@mui/material';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
function Dashboard() {

  const [questionPapers, setQuestionPapers] = useState([])
  const [showModal, setShowModal] = useState(false);
  const [viewPaper, setViewPaper] = useState([])

  const navigate = useNavigate()      //navigation

  useEffect(() => {
    getQuestionService().then(res => {
      setQuestionPapers(reducePaper(res.data.user))
    })
      .catch(err => {
        alert(err.response.data.message)
      })
  }, [])

  const reducePaper = (data) => {
    console.log(data, "data")
    let ques = data.reduce(function (acc, obj) {//prev,current
      let key = obj["subjectName"]
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(obj)
      console.log(acc, "Acc")
      return acc
    }, {})
    // [{"signs":[paper1,paper2]},{"maths":[paper1,paper2]}]
    console.log(ques, "ques")
    const keys = Object.keys(ques);
    console.log(keys)
    const arr = []
    keys.forEach((key) => {
      arr.push({ [key]: ques[key] })
    });
    console.log(arr, "Arr")
    return arr
  }

  const handleViewPaper = (arr) => {
    setShowModal(true);
    setViewPaper(arr)
  };
  return (
    <div>
      <Navvbar />

      <div>
        <button className="addPaperButton" style={{ "marginLeft": "3em" }}>
          <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"></path><path d="M5 13c0-5.088 2.903-9.436 7-11.182C16.097 3.564 19 7.912 19 13c0 .823-.076 1.626-.22 2.403l1.94 1.832a.5.5 0 0 1 .095.603l-2.495 4.575a.5.5 0 0 1-.793.114l-2.234-2.234a1 1 0 0 0-.707-.293H9.414a1 1 0 0 0-.707.293l-2.234 2.234a.5.5 0 0 1-.793-.114l-2.495-4.575a.5.5 0 0 1 .095-.603l1.94-1.832C5.077 14.626 5 13.823 5 13zm1.476 6.696l.817-.817A3 3 0 0 1 9.414 18h5.172a3 3 0 0 1 2.121.879l.817.817.982-1.8-1.1-1.04a2 2 0 0 1-.593-1.82c.124-.664.187-1.345.187-2.036 0-3.87-1.995-7.3-5-8.96C8.995 5.7 7 9.13 7 13c0 .691.063 1.372.187 2.037a2 2 0 0 1-.593 1.82l-1.1 1.039.982 1.8zM12 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" fill="currentColor"></path></svg>
          <span onClick={() => navigate('/create')}>Add Paper</span>
        </button>
      </div>
      <Container className="mt-5">
        <Grid container spacing={2} >
          {questionPapers.map((ele, index) =>
            <Grid item xs={12} sm={6} md={4} key={index} >
              <Card variant="outlined" className="cardContainerShadow">
                <CardContent>
                  <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
                    <p><span className="subjNameText">Subject Name:</span> <span className="subjNameText">{Object.keys(ele)[0]}</span></p>
                  </Typography>

                  <Typography sx={{ mb: 1.5, fontSize: 16 }} color="text.secondary" className="noOfPapersText">
                    No of papers:{ele[Object.keys(ele)[0]].length}
                  </Typography>
                </CardContent>
                <CardActions className="text-center">
                  <button onClick={() => handleViewPaper(ele[Object.keys(ele)[0]])} className="previewPaper">Preview Paper</button>
                </CardActions>
              </Card>

            </Grid>

          )}
        </Grid>
      </Container>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h3 className="viewPaper">No. of Papers : {viewPaper.length} </h3>
          <Paper elevation={3} className="p-4 mt-2" >
            {viewPaper.map((ele, index) =>
              <>
                <h4 className="m-3 viewPaper"> {ele.subjectName} paper : {index + 1}
                </h4>
                <Button variant="contained" color="success" onClick={() => navigate('/preview', { state: ele })} className="ml-4">
                  View
                </Button>
              </>
            )}
          </Paper>
        </Box>
      </Modal>
    </div>
  );
}

export default Dashboard;




