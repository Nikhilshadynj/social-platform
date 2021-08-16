// require('dotenv').config()
// const imageThumbnail = require('image-thumbnail');
// const changeBuffer = async (data)=>{
//     console.log('second')
//     console.log('data')
//     try{
//         const thumbnail = await imageThumbnail({uri : data});
//         console.log(thumbnail);
//     }catch(e){
//         console.log('error',e.message)
//     }
// }
// const sample = (async (req, res) => {
//     if (req.files.file) {
//         let filePath = path.join(process.cwd(),'public','sample')
//         var ext = req.files.file.name.split('.').pop();
//         var file_name = '123456' + '.' + ext;
//         req.files.file.mv(path.join(filePath, file_name))
//         callback('http://localhost:4050/sample/123456.webm');
//     console.log('first')
//     return res.send('success')
//     }
// },changeBuffer(data))





// module.exports = {sample}