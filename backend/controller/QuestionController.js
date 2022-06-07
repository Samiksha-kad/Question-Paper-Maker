import QuestionModel from "../models/questionsSchema.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import sendData from "../middleware/SendData.js";

export const question = async (req, res, next) => {
  try {
    let ins = await new QuestionModel({
      subjectName: req.body.subjectName,
      Paper: req.body.Paper,
      email: req.body.email,
      marks: req.body.marks,
    });

    ins.save((e) => {
      if (e) {
        next(new ErrorHandler("Something went wrong in adding data", 500));
      } else {
        next(new ErrorHandler("Data Saved", 201));
      }
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 404));
  }
};
export const questionUpdate = async (req, res, next) => {
  try {
    let ins = await new QuestionModel.findOneAndUpdate(
      { email: req.body },
      {
        subjectName: req.body.subjectName,
        Paper: req.body.Paper,
        email: req.body.email,
        marks: req.body.marks,
      }
    );

    ins.save((e) => {
      if (e) {
        next(new ErrorHandler("Something went wrong in adding data", 500));
      } else {
        next(new ErrorHandler("Data Saved", 201));
      }
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 404));
  }
};
export const getQuestionPaper = (req, res, next) => {
  try {
    QuestionModel.find({ flag: 1 }, (err, data) => {
      if (err) {
        next(new ErrorHandler("Something went wrong in adding data", 500));
      } else {
        // req.sendData = data;
        // req.succesCode = 200;
        // next()
        sendData(data, 200, res);
      }
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 404));
  }
};

export const QuestionDelete = (req, res, next) => {
  try {
    console.log(req.body.id);
    QuestionModel.findOneAndUpdate(
      { _id: req.body.id },
      { $set: { flag: 0 } },
      { new: true },
      (err, data) => {
        if (err) {
          next(new ErrorHandler("something went wrong", 404));
        } else {
          next(new ErrorHandler("data deleted", 200));
        }
      }
    );
  } catch (error) {
    next(new ErrorHandler("error.message ", 404));
  }
};
export const UpdateQuestion = (req, res, next) => {
  try {
    QuestionModel.findOneAndUpdate(
      { _id: req.body.id },
      { $set: { Paper: req.body.Paper, marks: req.body.marks } },
      { new: true },
      (err, data) => {
        if (err) {
          next(new ErrorHandler("something went wrong", 404));
        } else {
          next(new ErrorHandler("data updated sucessfully ", 200));
        }
      }
    );
  } catch (error) {
    next(new ErrorHandler(error.message, 404));
  }
};
