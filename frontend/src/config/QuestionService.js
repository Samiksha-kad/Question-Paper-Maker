import axios from 'axios'
import {MAIN_URL} from './Url';
// post and get service
export function QuestionAddService(data){
    return axios.post(`${MAIN_URL}posts/questionAddService`,data)
}
export function QuestionDeleteService(data){
    return axios.post(`${MAIN_URL}posts/questionDeleteService`,data)
}
export function UpdateQuestionService(data){
    return axios.post(`${MAIN_URL}posts/updateQuestionService`,data) 
}
export function getQuestionService(){

    return axios.get(`${MAIN_URL}posts/getQuestionService`)
}  