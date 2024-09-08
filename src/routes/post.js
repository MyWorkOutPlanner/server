import { Router } from "express";
import { getRoute } from "../controllers/postController.js";

const router = Router()
const post = [ 
    {id: 1},
    {id: 2},
    {id: 3, title : 'hi'}

]
router.get('/', getRoute)

router.get('/:id',(req,res, next)=>{
    console.log(req.session.id)
    let val = parseInt( req.params.id)
    const poste = post.find((i) => i.id === val)
    if(!poste){
        const error = new Error(' A Title is Missing not Found');
        return next(error)
    }
    res.status(200).json({poste})
 })
 router.post('/',(req,res) => {
    console.log(req.body,'req')
    const newpost = {
        id: post.length+1,
        title : req.body.title
    }
    post.push(newpost)
    
    res.status(200).json(post)
 })
router.put('/:id', (req, res, next) => {
    let id = parseInt(req.params.id); 
    const poste = post.find((i)=> i.id=== id )
if(!poste.title){
    const error = new Error(' A Title is Missing not Found');
    return next(error)
}
    poste.title = req.body.title
    res.status(200).json(post)
    
})
router.delete('/:id',(req,res) => {
    let id = req.params.id
    let poste = post.filter((i)=> id !==i )
    res.status(200).json(poste)
})
 export default router