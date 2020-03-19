// jshint esversion:6

const express = require('express');
const app = express();
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const _ = require("lodash");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');


mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true });

const itemschema = new mongoose.Schema({
    name: {
        type: String,
        max: 100,
        min: 1,
        required: [true, "Listitem must has a name"],
    }
});

const listschema = new mongoose.Schema({
    name: String,
    item: [itemschema],
});

const Item = mongoose.model("Item", itemschema);
const List = mongoose.model("List", listschema);

const Item1 = new Item({
    name: "Buy Food"
});
const Item2 = new Item({
    name: "Eat Food"
});
const Item3 = new Item({
    name: "Cook Food"
});

const itemList = [Item1, Item2, Item3];

app.get('/', (req, res) => {
    Item.find({}, (err, todo) => {

        if (todo.length === 0) {
            Item.create(itemList, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully created items");
                    res.redirect('/');
                }
            });
        } else {
            res.render('list', { listitem: "Today", todo: todo });
        }
    });
});

app.post('/', (req, res) => {
    let item = req.body.item;
    let listItem = req.body.list;
    const newitem = new Item({
        name: item
    });

    if (req.body.list === 'Today') {
        Item.create({ name: item }, (err, todo) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/');
            }
        });
    } else {
        List.findOne({ name: listItem }, (err, foundItem) => {
            if (!err) {
                foundItem.item.push(newitem);
                foundItem.save();
                res.redirect('/' + foundItem.name);
            }
        });
    }
});

app.post('/delete', (req, res) => {
    const check = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove(check, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                // console.log(data);
                res.redirect('/');
            }
        });
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { item: { _id: check } } }, (err, item) => {
            if (!err) {
                res.redirect("/" + item.name);
            }
        });
    }

});

app.get('/:aboutList', (req, res) => {
    const aboutList = _.capitalize(req.params.aboutList);

    List.findOne({ name: aboutList }, (err, data) => {
        if (!err) {
            if (!data) {
                console.log("Does not exists");
                const list = new List({
                    name: aboutList,
                    item: itemList,
                });
                list.save();
                res.redirect('/' + aboutList);
            } else {
                // console.log('Exists');
                res.render('list', { listitem: data.name, todo: data.item });
            }
        }
    });
});



app.listen(3000, () => console.log('Server is running'));