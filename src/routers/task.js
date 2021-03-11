const express = require('express')
const router = new express.Router()
const auth = require('../middelware/auth')
const Tasks = require('../models/Task')
require('mongoose')
/*Create Task */
router.post('/tasks', auth, async (req, res) =>{

    const task = new Tasks({
      ...req.body,
      owner: req.user._id,
    })

    try {
        await task.save()
        res.status(200).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Find all tasks
//GET /tasks?completed=true
//GET /tasks?limit=10&skip=20
//GET /tasks?sortBy=createdAt:desc
//GET /tasks?page
// For page 1, the skip is: (1 - 1) * 2 => 0 * 2 = 0
// For page 2, the skip is: (2 - 1) * 2 => 1 * 2 = 2
router.get('/tasks', auth ,async (req,res) => {
    const match = {}
    const sort ={}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
       
        const page = parseInt(req.query.page)  //convert tp number frpm string
        const page_size = 2 // Similar to 'limit'
        const skip = (page - 1) 
        await req.user.populate({
             path:'tasks',
             match,
             options:{
                 limit: (page_size),
                 skip:(skip),
                 sort
             }
         }).execPopulate()
        res.status(200).send(req.user.tasks)
    } catch (e) {
       res.status(400).send(e) 
    }

})

//find task by id
router.get('/tasks/:id', auth , async (req,res) => {
    const _id = req.params.id
    try {
        const task = await Tasks.findOne( { _id, owner: req.user._id })
        if(!task){
            return res.status(400).send(e)
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

//update task by id
router.patch('/tasks/:id', auth ,async (req,res) =>{

const updates = Object.keys(req.body)
const alloption = ["description","completed"]
const isupdates =  updates.every((update) => alloption.includes(update))

if(!isupdates){
        res.status(400).send({error:' Error in updates'})
    }

    try {
        const task = await Tasks.findOne({ _id: req.params.id, owner: req.user._id })
        if(!task){
          return res.status(404).send('no task with this id')
        }

         updates.forEach((update) => task[update] = req.body[update])
         await task.save()
         res.send(task)

    } catch (e) {
        res.status(500).send('error to update')
    }
})

//delete task by id
router.delete('/tasks/:id', auth ,async (req,res) => {
    try {
        const task = await Tasks.findOneAndDelete({ _id:req.params.id, owner:req.user._id})
        
        if(!task){
            return res.status(404).send({Error:'task dont found'})
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})


module.exports = router