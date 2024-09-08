const post = [ 
    {id: 1},
    {id: 2},
    {id: 3, title : 'hi'}

]
export const getRoute = (req,res) => {
    console.log(req.session.id)
    console.log(req.cookies)
    req.session.visited = true // will prevent from Change of session on Every send
    res.cookie("hello","Balaji",{maxAge : 3000})
    res.status(200).json(post)
}