const express = require('express');
const app = express();
const ExpressError = require('./expressError');
const { findMean, findMedian, findMode } = require('./calculations');

function stringArrToNumsArr(nums) {
    let result = [];

    for (let i = 0; i < nums.length; i++) {
        let strToInt = Number(nums[i]);

        if (Number.isNaN(strToInt)) {
            return new Error(
                `The value '${nums[i]}' at index ${i} is not a valid number.`
            )
        }

        result.push(strToInt);
    }
    return result;
}

app.get('/mean', function (req, res, next) {
    if (!req.query.nums) {
        throw new ExpressError('Must pass a query key of nums with a comma-separated list of numbers.', 400);
    }

    let stringOfNums = req.query.nums.split(',');
    let nums = stringArrToNumsArr(stringOfNums);

    if (nums instanceof Error) {
        throw new ExpressError(nums.message);
    }

    let result = {
        operation: "mean",
        value: findMean(nums)
    }
    return res.send(result);
});

app.get('/median', function (req, res, next) {
    if (!req.query.nums) {
        throw new ExpressError('Must pass a query key of nums with a comma-separated list of numbers.', 400);
    }

    let stringOfNums = req.query.nums.split(',');
    let nums = stringArrToNumsArr(stringOfNums);

    if (nums instanceof Error) {
        throw new ExpressError(nums.message);
    }

    let result = {
        operation: "median",
        value: findMedian(nums)
    }
    return res.send(result);
});

app.get('/mode', function (req, res, next) {
    if (!req.query.nums) {
        throw new ExpressError('Must pass a query key of nums with a comma-separated list of numbers.', 400);
    }

    let stringOfNums = req.query.nums.split(',');
    let nums = stringArrToNumsArr(stringOfNums);

    if (nums instanceof Error) {
        throw new ExpressError(nums.message);
    }

    let result = {
        operation: "mode",
        value: findMode(nums)
    }
    return res.send(result);
});

/** general error handler */

app.use(function (req, res, next) {
    const err = new ExpressError("Not Found", 404);

    // pass the error to the next piece of middleware
    return next(err);
});

/** general error handler */

app.use(function (err, req, res, next) {
    res.status(err.status || 500);

    return res.json({
        error: err,
        message: err.message
    });
});

app.listen(3000, function () {
    console.log('Server starting on port 3000');
})