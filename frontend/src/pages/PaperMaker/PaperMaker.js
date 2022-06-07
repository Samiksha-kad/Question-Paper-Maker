import React, { useState, useEffect } from 'react';
import { Card, CardContent, Container, TextField, InputLabel, MenuItem, FormControl, Select, Grid, Box, Button } from '@mui/material';
import { GrRadialSelected } from "react-icons/gr";
import { ImParagraphLeft } from "react-icons/im";
import { Editor } from 'react-draft-wysiwyg';
import { convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Boolean from './Boolean';
import { MdEdit, MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import { QuestionAddService } from '../../config/QuestionService'
import jwtdecode from 'jwt-decode';
import Navvbar from '../Navvbar/Navvbar';
import { Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router'

import './PaperMaker.css'

export default function PaperMaker() {

    const [selectDropDownType, setSelectDropDownType] = useState('');
    const [isFlag, setIsFlag] = useState({ mcq: false, op_boolean: false, brief: false, openAnswer: false })
    const [marks, setMarks] = useState({ open: false, grade: 0 })
    const [createQuestionPaper, setCreateQuestionPaper] = useState({ question: '', subjectTitle: '', answer: '', option1: '', option2: '', option3: '', option4: '', edit: false, index: null })
    const [errors, setErrors] = useState({ errquestion: '', erranswer: '', errno: '', errsubjectTitle: '', errOption1: '', errOption2: '', errOption3: '', errOption4: '' })
    const [email, setEmail] = useState('')
    const [viewQuestion, setViewQuestion] = useState([])
    const navigate = useNavigate()


    let editorState = EditorState.createEmpty();
    let [des, setDes] = useState(editorState);


    useEffect(() => {
        if (localStorage.getItem('question') !== null) {
            let data = [...JSON.parse(localStorage.getItem('question'))]
            setViewQuestion([...data])
        }
        if (localStorage.getItem('_token') !== null) {
            let token = localStorage.getItem('_token');
            let decode = jwtdecode(token)
            setEmail(decode.email)
        }
    }, [])

    const handleDropDownChange = (event) => {
        setSelectDropDownType(event.target.value);
        if (event.target.value === 'mcq') {
            setIsFlag({ ...isFlag, mcq: true, op_boolean: false, brief: false, openAnswer: true })
        }
        else if (event.target.value === 'boolean') {
            setIsFlag({ ...isFlag, op_boolean: true, mcq: false, brief: false, openAnswer: true })

        }
        else {
            setIsFlag({ ...isFlag, brief: true, op_boolean: false, mcq: false, openAnswer: false })

        }
    };

    const onEditorStateChange = (editorState) => {
        setDes(editorState)
    }
    const handleError = (event) => {
        const { name, value } = event.target;
        let error;
        switch (name) {
            case "question":
                error = value !== '' ? "" : "Question is required";
                setErrors({ ...errors, errquestion: error });
                break;

            case "answer":
                error = value !== '' ? "" : "Answer is required";
                setErrors({ ...errors, erranswer: error });
                break;

            case "subjectTitle":
                error = value !== '' ? "" : "Subject Title  is required";
                setErrors({ ...errors, errsubjectTitle: error });
                break;
            case "option1":
                error = value !== '' ? "" : "Option  is required";
                setErrors({ ...errors, errOption1: error });
                break;

            case "option2":
                error = value !== '' ? "" : "Option  is required";
                setErrors({ ...errors, errOption2: error });
                break;
            case "option3":
                error = value !== '' ? "" : "Option  is required";
                setErrors({ ...errors, errOption3: error });
                break;
            case "option4":
                error = value !== '' ? "" : "Option  is required";
                setErrors({ ...errors, errOption4: error });
                break;
            default: return 0;
        }
        setCreateQuestionPaper({ ...createQuestionPaper, [name]: value })

    }
    const submitQuestionPaper = () => {
        if (createQuestionPaper.subjectTitle !== '' && viewQuestion.length !== 0) {
            let total = 0;
            viewQuestion.forEach((c) => {
                total += parseInt(c.marks)
            })
            const FormData = {
                subjectName: createQuestionPaper.subjectTitle,
                Paper: viewQuestion,
                marks: total,
                email: email,
            }
            QuestionAddService(FormData)
                .then(res => {
                    setViewQuestion([])
                    setCreateQuestionPaper({ ...createQuestionPaper, subjectTitle: '' })
                    localStorage.removeItem('question')
                    alert(res.data.message)
                    navigate("/")
                })
                .catch(err => {
                    alert(err.response.data.message)
                })

            localStorage.removeItem('question')
        }
        else {
            alert('data no added')
        }

    }

    const addQuestion = () => {
        if (createQuestionPaper.question !== '' && marks.grade !== 0) {
            if (marks.grade >= 0) {

                if (selectDropDownType === 'mcq') {
                    if (createQuestionPaper.option1 !== '' && createQuestionPaper.option2 !== '' && createQuestionPaper.option3 !== '') {
                        const FormData = {
                            question: createQuestionPaper.question,
                            answer: createQuestionPaper.answer,
                            type: selectDropDownType,
                            option1: createQuestionPaper.option1,
                            option2: createQuestionPaper.option2,
                            option3: createQuestionPaper.option3,
                            option4: createQuestionPaper.option4,
                            marks: marks.grade,
                        }
                        setViewQuestion([...viewQuestion, FormData])
                        localStorage.setItem('question', JSON.stringify([...viewQuestion, FormData, createQuestionPaper.subjectTitle]))
                        setCreateQuestionPaper({ ...createQuestionPaper, question: '', answer: '', option1: '', option2: '', option3: '', option4: '' })

                        setMarks({ ...marks, grade: 0 })
                        // document.getElementById('demo-simple-select').selectedIndex = "2"
                    }
                    else {
                        alert("Cannot Submit Empty Fields in option")
                    }

                }
                else if (selectDropDownType === 'boolean') {
                    const FormData = {
                        question: createQuestionPaper.question,
                        answer: createQuestionPaper.answer,
                        type: selectDropDownType,
                        marks: marks.grade
                    }
                    setViewQuestion([...viewQuestion, FormData])
                    localStorage.setItem('question', JSON.stringify([...viewQuestion, FormData]))
                    setCreateQuestionPaper({ ...createQuestionPaper, question: '', answer: '' })
                    setMarks({ ...marks, grade: 0 })

                    document.getElementById('demo-simple-select').selectedIndex = '2'

                }
                else if (selectDropDownType === 'brief') {
                    const FormData = {
                        question: createQuestionPaper.question,
                        answer: createQuestionPaper.des.value,
                        type: selectDropDownType,
                        marks: marks.grade
                    }
                    setViewQuestion([...viewQuestion, FormData])
                    localStorage.setItem('question', JSON.stringify([...viewQuestion, FormData]))
                    setCreateQuestionPaper({ ...createQuestionPaper, question: '', answer: '' })
                    setMarks({ ...marks, grade: 0 })
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
            alert("Cannot Submit Empty Fields ")
        }
    }

    const editQuestion = (ele, i) => {
        setCreateQuestionPaper({ ...createQuestionPaper, edit: true, index: i, question: ele.question, answer: ele.answer, option1: ele.option1, option2: ele.option2, option3: ele.option3, option4: ele.option4 })
        setMarks({ ...marks, grade: ele.marks })

    }

    const updateQuestion = () => {
        let data = viewQuestion
        if (createQuestionPaper.question !== '' && createQuestionPaper.answer !== '' && marks.grade !== 0) {
            if (marks.grade >= 0) {

                if (selectDropDownType === 'mcq') {
                    if (createQuestionPaper.option1 !== '' && createQuestionPaper.option2 !== '' && createQuestionPaper.option3 !== '') {
                        const FormData = {
                            question: createQuestionPaper.question,
                            answer: createQuestionPaper.answer,
                            type: selectDropDownType,
                            option1: createQuestionPaper.option1,
                            option2: createQuestionPaper.option2,
                            option3: createQuestionPaper.option3,
                            option4: createQuestionPaper.option4,
                            marks: marks.grade,
                        }
                        setMarks({ ...marks, grade: 0 })
                        data.splice(createQuestionPaper.index, 1, FormData);
                        setViewQuestion([...data])
                        localStorage.setItem('question', JSON.stringify([...data]))
                        setCreateQuestionPaper({ ...createQuestionPaper, question: '', answer: '', option1: '', option2: '', option3: '', option4: '', edit: false, index: null })

                    }
                    else {
                        alert("Cannot Submit Empty Fields in option")
                    }

                }
                else if (selectDropDownType === 'boolean' || selectDropDownType === 'brief') {
                    const FormData = {
                        question: createQuestionPaper.question,
                        answer: createQuestionPaper.answer,
                        type: selectDropDownType,
                        marks: marks.grade,

                    }
                    data.splice(createQuestionPaper.index, 1, FormData);
                    setViewQuestion([...data])
                    localStorage.setItem('question', JSON.stringify([...data]))
                    setCreateQuestionPaper({ ...createQuestionPaper, question: '', answer: '', edit: false })
                    setMarks({ ...marks, grade: 0 })

                    document.getElementById('demo-simple-select').selectedIndex = '2'

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

    const deleteQuestion = (i) => {
        let data = viewQuestion
        data.splice(i, 1)
        setViewQuestion([...data])
        localStorage.setItem('question', JSON.stringify([...data]))
    }
    return (
        <>
            {
                localStorage.getItem("_token") !== null ?
                    <>
                        <Navvbar />
                        <Container>
                            <Card sx={{ minWidth: 200, mt: 4 }}>
                                <CardContent>
                                    <TextField id="standard-basic" variant="standard" value={createQuestionPaper.subjectTitle} label="Subject Name" name="subjectTitle" onChange={handleError} />
                                    <br />
                                    <span className="text-danger text-left" >{errors.errsubjectTitle}</span>
                                </CardContent>
                            </Card>
                            {
                                viewQuestion.map((ele, index) =>
                                    <Card className="mb-4">
                                        <nav className="navbar navbar-light bg-light justify-content-between">
                                            <p className="navbar-brand"><span className="questionText">Question : </span>{ele.question}</p>
                                            <div className="form-inline">

                                                <Button variant="outlined" color="primary" sx={{ height: "30px" }} onClick={() => editQuestion(ele, index)}><RiEdit2Fill /></Button>
                                                &nbsp;&nbsp;

                                                <Button variant="outlined" color="error" sx={{ height: "30px" }} onClick={() => deleteQuestion(index)}>
                                                    <MdDelete />
                                                </Button>
                                                &nbsp;&nbsp;
                                            </div>
                                        </nav>
                                        {ele.type === 'mcq' &&
                                            <>
                                                <ul>
                                                    <li className="optionsText">
                                                        {ele.option1}

                                                    </li>
                                                    <br />

                                                    <li className="optionsText">
                                                        {ele.option2}
                                                    </li >
                                                    <br />

                                                    <li className="optionsText">

                                                        {ele.option3}
                                                    </li>
                                                    <br />

                                                    <li className="optionsText">

                                                        {ele.option4}
                                                    </li>
                                                    <br />
                                                </ul>
                                            </>

                                        }
                                        {
                                            ele.type === 'boolean' &&
                                            <ul>
                                                <li>True</li>
                                                <li>False</li>
                                            </ul>
                                        }
                                        <p><span className="answerText">Answer : </span>{ele.answer}</p>
                                        <p><span className="marksText">Marks : </span>{ele.marks}</p>

                                    </Card>
                                )
                            }
                            <Card sx={{ minWidth: 200 }}>
                                <CardContent>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={8} >

                                                <TextField id="filled-basic" label="Question" variant="filled" sx={{ width: 700 }} value={createQuestionPaper.question} onChange={handleError} name="question" />
                                                <span className="text-danger text-left" >{errors.errquestion}</span>

                                            </Grid>
                                            <Grid item xs={4}>

                                                <Box sx={{ width: 300 }}>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="demo-simple-select-label">Select Type</InputLabel>

                                                        <Select
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={selectDropDownType}
                                                            label="Select Type"
                                                            onChange={handleDropDownChange}
                                                            defaultValue="mcq"

                                                        >
                                                            <MenuItem value="mcq">
                                                                <GrRadialSelected sx={{ mr: 13 }} />
                                                                &nbsp;&nbsp;Multiple Choice</MenuItem>
                                                            <MenuItem value="boolean">True/False</MenuItem>
                                                            <MenuItem value="brief">
                                                                <ImParagraphLeft />
                                                                &nbsp;&nbsp;Brief</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Box>

                                            </Grid>

                                        </Grid>
                                    </Box>
                                    {/* Change Ui */}
                                    {
                                        isFlag.mcq &&
                                        <div>
                                            <ul>
                                                {/* Option 1 */}

                                                <li type="circle">
                                                    <TextField id="standard-basic" variant="standard" name="option1" value={createQuestionPaper.option1}
                                                        label="option 1" onChange={handleError}
                                                        className="w-75" />

                                                </li>
                                                <br />
                                                <span className="text-danger text-left" >{errors.errOption1}</span>
                                                {/* Option 2*/}
                                                <li type="circle">
                                                    <TextField id="standard-basic" variant="standard" name="option2" value={createQuestionPaper.option2}
                                                        label="option 2" onChange={handleError} className="w-75" />
                                                </li >
                                                <br />
                                                <span className="text-danger text-left" >{errors.errOption2}</span>
                                                {/* Option 3 */}
                                                <li type="circle">

                                                    <TextField id="standard-basic" variant="standard" name="option3" value={createQuestionPaper.option3}
                                                        label="option 3" onChange={handleError} className="w-75" />
                                                </li>
                                                <br />
                                                <span className="text-danger text-left" >{errors.errOption3}</span>
                                                {/* Option 4 */}
                                                <li type="circle">

                                                    <TextField id="standard-basic" variant="standard" name="option4" value={createQuestionPaper.option4}
                                                        label="option 4" onChange={handleError} className="w-75" />
                                                </li>
                                                <br />
                                                <span className="text-danger text-left" >{errors.errOption4}</span>
                                            </ul>

                                        </div>
                                    }
                                    {
                                        isFlag.brief &&
                                        <>
                                            <Editor
                                                editorState={des}
                                                toolbarClassName="toolbarClassName"
                                                wrapperClassName="wrapperClassName"
                                                editorClassName="editorClassName"
                                                onEditorStateChange={onEditorStateChange}
                                                editorStyle={{ border: '2px solid white' }}

                                            />
                                            {console.log(des, "des")}

                                            <textarea style={{ display: "none" }}
                                                ref={(val) => (createQuestionPaper.des = val)} value={draftToHtml(
                                                    convertToRaw(
                                                        des.getCurrentContent()
                                                    )
                                                )} />
                                        </>
                                    }

                                    {isFlag.op_boolean && <Boolean />}



                                </CardContent>
                                {isFlag.openAnswer &&
                                    <CardContent>
                                        <TextField id="filled-basic" variant="filled" sx={{ width: 1000, mt: 3 }} value={createQuestionPaper.answer} onChange={handleError} label="answer" name="answer" />
                                        <br />
                                        <span className="text-danger text-left" >{errors.erranswer}</span>
                                    </CardContent>
                                }

                                <CardContent>
                                    <p>Marks {marks.grade} &nbsp;&nbsp;
                                        <Button variant="contained" onClick={() => setMarks({ ...marks, open: true })}><MdEdit style={{ cursor: "pointer" }} /></Button>

                                    </p>

                                    {marks.open &&
                                        <>
                                            <TextField id="standard-basic" variant="standard" name="grade" value={marks.grade} label="Marks"
                                                onChange={(e) => setMarks({ ...marks, grade: e.target.value })}
                                            />
                                            <Button variant="outlined" color="secondary" onClick={() => setMarks({ ...marks, open: false })}>Submit</Button>

                                        </>
                                    }
                                </CardContent>

                            </Card>
                            <br />
                            <br />
                            {createQuestionPaper.edit ?

                                <Button variant="outlined" color="warning" onClick={() => updateQuestion()}>Update</Button>
                                :
                                <Button variant="outlined" color="primary" onClick={() => addQuestion()}>Add Question</Button>

                            }

                            <br />
                            <br />

                            <Button variant="contained" color="success" onClick={() => submitQuestionPaper()}>Save</Button>
                        </Container>

                    </>
                    :
                    <Navigate to="/login"></Navigate>
            }
        </>
    );
}



