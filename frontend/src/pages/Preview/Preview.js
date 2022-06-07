import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { Card, CardContent, TextField, Grid, Box, Button } from '@mui/material';
import { UpdateQuestionService, QuestionDeleteService } from '../../config/QuestionService';
import { useNavigate } from 'react-router'


import './Preview.css'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
function Preview() {
    const location = useLocation();
    const navigate = useNavigate()
    const [allQuestion, setAllQuestion] = useState([])
    const [totalMarks, setTotalMarks] = useState(0)
    const [editQuestions, setEditQuestions] = useState({ question: '', answer: '', option1: '', option2: '', option3: '', option4: '', marks: 0, edit: false, open: false, index: null })
    const [errors, setErrors] = useState({ errquestion: '', erranswer: '', errno: '', errsubjectTitle: '', errOption1: '', errOption2: '', errOption3: '', errOption4: '' })
    const [dropDownType, setDropDownType] = useState('');
    const [viewAnswer, setViewAnswer] = useState(false)
    const [isLogin, setIsLogin] = useState(false)


    useEffect(() => {
        setAllQuestion(location.state.Paper)
        console.log(location.state.Paper)
        let total = 0;
        location.state.Paper.forEach((c) => {
            total += parseInt(c.marks)
            setTotalMarks(total)
        })
        if (localStorage.getItem('_token') !== null) {
            setIsLogin(true)
        }

    }, [location.state.Paper])


    const modifyQuestion = (ele, i) => {
        setEditQuestions({ ...editQuestions, edit: true, question: ele.question, answer: ele.answer, option1: ele.option1, option2: ele.option2, option3: ele.option3, option4: ele.option4, index: i, marks: ele.marks, open: true })
        setDropDownType(ele.type)

    }
    const deleteQuestion = () => {
        QuestionDeleteService({ id: location.state._id })
            .then(res => {
                navigate('/')
            })
            .catch(err => {
                alert(err.response.data.message)
            })
    }
    const updateQuestion = () => {
        let data = allQuestion

        if (editQuestions.question !== '' && editQuestions.answer !== '' &&
            editQuestions.marks !== 0) {
            if (editQuestions.marks >= 0) {
                if (dropDownType === 'mcq') {
                    if (editQuestions.option1 !== '' && editQuestions.option2 !== '' && editQuestions.option3 !== '') {
                        const FormData = {
                            question: editQuestions.question,
                            answer: editQuestions.answer,
                            type: dropDownType,
                            option1: editQuestions.option1,
                            option2: editQuestions.option2,
                            option3: editQuestions.option3,
                            option4: editQuestions.option4,
                            marks: editQuestions.marks,
                        }
                        data.splice(editQuestions.index, 1, FormData);
                        setAllQuestion([...data])
                        setEditQuestions({ ...editQuestions, marks: 0 })
                        localStorage.setItem('question', JSON.stringify([...data]))
                        setEditQuestions({ ...editQuestions, question: '', answer: '', option1: '', option2: '', option3: '', option4: '', edit: false, index: null, open: false })
                    }
                    else {
                        alert("Cannot Submit Empty Fields in option")
                    }

                }
                else if (dropDownType === 'boolean' || dropDownType === 'brief') {
                    const FormData = {
                        question: editQuestions.question,
                        answer: editQuestions.answer,
                        type: dropDownType,
                        marks: editQuestions.marks,

                    }
                    data.splice(editQuestions.index, 1, FormData);
                    setAllQuestion(data)
                    localStorage.setItem('question', JSON.stringify(data))
                    setEditQuestions({ ...editQuestions, question: '', answer: '', marks: 0, open: false })
                }
                else {
                    alert("Cannot Submit Empty Fields in type")
                }
            }
            else {
                alert("Marks cannot be negative")
            }

        }
        else {
            alert("Cannot Submit Empty Fields in option")
        }

    }
    const handleError = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case "question":
                let error1 = value !== '' ? "" : "Question is required";
                setErrors({ ...errors, errquestion: error1 });
                break;

            case "answer":
                let error2 = value !== '' ? "" : "Answer is required";
                setErrors({ ...errors, erranswer: error2 });
                break;

            case "subjectTitle":
                let error3 = value !== '' ? "" : "Subject Title  is required";
                setErrors({ ...errors, errsubjectTitle: error3 });
                break;
            case "option1":
                let error4 = value !== '' ? "" : "Option  is required";
                setErrors({ ...errors, errOption1: error4 });
                break;

            case "option2":
                let error5 = value !== '' ? "" : "Option  is required";
                setErrors({ ...errors, errOption2: error5 });
                break;
            case "option3":
                let error6 = value !== '' ? "" : "Option  is required";
                setErrors({ ...errors, errOption3: error6 });
                break;
            case "option4":
                let error7 = value !== '' ? "" : "Option  is required";
                setErrors({ ...errors, errOption4: error7 });
                break;



            default: return 0;
        }
        setEditQuestions({ ...editQuestions, [name]: value })

    }
    const SaveQuestionPaper = () => {
        console.log(JSON.parse(localStorage.getItem('question')), "localstorage")
        if (allQuestion.length !== 0) {
            let total = 0;
            allQuestion.forEach((c) => {
                total += parseInt(c.marks)
            })
            const FormData = {
                Paper: allQuestion,
                marks: total,
                id: location.state._id
            }
            UpdateQuestionService(FormData)
                .then(res => {
                    localStorage.removeItem('question')
                    alert(res.data.message)
                    navigate('/')
                })
                .catch(err => {
                    alert(err.response.data.message)
                })
        }
        else {
            alert('data no added')
        }
    }
    const goBack = () => {
        if (window.confirm("Are you sure you want to go back?? Data will loss") === true) {
            localStorage.removeItem('question')
            navigate('/')
        }
    }



    return (
        <div className="containerPage">
            <nav class="navbar">
                <div class="container-fluid">
                    <Button variant="outlined" color="error" onClick={() => goBack()} sx={{ m: 3 }}>Go Back</Button>
                    <form className="form-inline">
                        <span style={{ marginRight: "5.3rem" }}>
                            <strong>Total Marks: </strong>{totalMarks}
                        </span>
                    </form>

                </div>
            </nav>

            <h4 className="headingSubjectName" >Subject : {location.state.subjectName}</h4>
            {allQuestion.map((ele, index) =>
                <div >
                    <nav className="navbar navbar-light bg-light justify-content-between">
                        <h5 className="questionText">{index + 1}.Ques:{ele.question}</h5>
                        <form className="form-inline">
                            <span style={{ marginRight: "5.3rem" }}><strong>Marks : </strong>{ele.marks}</span>
                        </form>
                    </nav>


                    {ele.type === 'mcq' &&
                        <>
                            <ul>

                                <li className="optionsText">{ele.option1}</li>
                                <li className="optionsText">{ele.option2}</li>
                                <li className="optionsText">{ele.option3}</li>
                                <li className="optionsText">{ele.option4}</li>
                            </ul>
                        </>
                    }
                    {ele.type === 'boolean' &&
                        <>
                            <ul>
                                <li className="boolenText">True</li>
                                <li className="boolenText">False</li>
                            </ul>


                        </>
                    }
                    {ele.type === 'brief' &&
                        <>


                            <div dangerouslySetInnerHTML={{ __html: ele.answer }} className="optionsText"></div>

                        </>
                    }


                    {viewAnswer &&

                        <h5 className="answerText">Ans:{ele.answer}
                        </h5>

                    }
                    {isLogin &&
                        <Button variant="outlined" color="info" onClick={() => modifyQuestion(ele, index)} sx={{ ml: 5, mb: 2 }}>Edit</Button>
                    }



                </div>
            )}
            <br />
            {isLogin &&
                <Button variant="contained" color="error" onClick={() => deleteQuestion()}
                    sx={{ ml: 5, mb: 2 }}>Delete Paper</Button>
            }

            <Card sx={{ minWidth: 200 }} className="m-4">

                {editQuestions.open &&
                    <div className="openEditText ">

                        <CardContent>
                            <Box sx={{ flexGrow: 1 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={8} >

                                        <TextField id="filled-basic" label="Question" variant="filled" sx={{ width: 700 }} value={editQuestions.question} onChange={handleError} name="question" />
                                        <span className="text-danger text-left" >{errors.errquestion}</span>

                                    </Grid>

                                </Grid>
                            </Box>
                            {/* Change Ui */}

                            {
                                dropDownType === 'mcq' &&
                                <div>
                                    <ul>
                                        {/* Option 1 */}

                                        <li type="circle">
                                            <TextField id="standard-basic" variant="standard" name="option1" value={editQuestions.option1}
                                                label="option 1" onChange={handleError} />

                                        </li>
                                        <br />
                                        <span className="text-danger text-left" >{errors.errOption1}</span>
                                        {/* Option 2*/}
                                        <li type="circle">
                                            <TextField id="standard-basic" variant="standard" name="option2" value={editQuestions.option2}
                                                label="option 2" onChange={handleError} />
                                        </li >
                                        <br />
                                        <span className="text-danger text-left" >{errors.errOption2}</span>
                                        {/* Option 3 */}
                                        <li type="circle">

                                            <TextField id="standard-basic" variant="standard" name="option3" value={editQuestions.option3}
                                                label="option 3" onChange={handleError} />
                                        </li>
                                        <br />
                                        <span className="text-danger text-left" >{errors.errOption3}</span>
                                        {/* Option 4 */}
                                        <li type="circle">

                                            <TextField id="standard-basic" variant="standard" name="option4" value={editQuestions.option4}
                                                label="option 4" onChange={handleError} />
                                        </li>
                                        <br />
                                        <span className="text-danger text-left" >{errors.errOption4}</span>
                                    </ul>

                                </div>
                            }

                            {dropDownType === 'boolean' && <ul>
                                <li type="circle">
                                    True

                                </li>
                                <br />
                                <li type="circle">
                                    False
                                </li >
                                <br />
                            </ul>}
                        </CardContent>
                        <CardContent>
                            <TextField id="filled-basic" variant="filled" sx={{ width: 1000, mt: 3 }} value={editQuestions.answer} onChange={handleError} label="answer" name="answer" />
                            <br />
                            <span className="text-danger text-left" >{errors.erranswer}</span>
                        </CardContent>


                        <CardContent>
                            <p>Marks {editQuestions.marks}  </p>
                            <>
                                <input type="number" name="grade" value={editQuestions.marks}
                                    onChange={(e) => setEditQuestions({ ...editQuestions, marks: e.target.value })}></input>

                            </>

                        </CardContent>


                        <Button variant="contained" color="warning" onClick={() => updateQuestion()} className="updateButton">Update</Button>


                    </div>
                }

            </Card>
            {isLogin &&
                <Button variant="contained" color="success" onClick={() => SaveQuestionPaper()} className="saveButton" sx={{ m: 3 }}>Save</Button>

            }

            {
                viewAnswer ?
                    <Button variant="contained" color="secondary" onClick={() => setViewAnswer(false)}>Hide Answer</Button>
                    :
                    <Button variant="contained" color="secondary" onClick={() => setViewAnswer(true)}
                        sx={{ m: 3 }}> View Answer</Button>


            }

        </div>
    );
}

export default Preview;

