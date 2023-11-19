const signupService = require('../services/signupService');

exports.registerUser = async (req,res)=>{
    try {
        const userData = req.body;
        const response = await signupService.registerUser(userData);
        res.status(201).json(response);
    }catch(err){
        console.log(err);
        res.status(500);
    }
}
exports.isIdDuplicates = async(req,res)=>{
    try{
        const userId = req.params.id;
        const response = await signupService.isIdDuplicates(userId);
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500);
    }
}
exports.isNicknameDuplicates = async(req,res)=>{
    try{
        const nickname = req.params.nickname;
        const response = await signupService.isNicknameDuplicates(nickname);
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500);
    }
}