import React, { Component } from "react";
import "./App.css";
import Tree from "./components/tree";
import axios from 'axios';

function format_tree_data(tree_data) {
  var children = []
  if (tree_data === null){
    return []
  }
  if (tree_data.answers !== undefined) {
    tree_data.answers.forEach(
      function (answer) {
        children.push({
          "title": answer.answer,
          "id": answer.id,
          "type": "A",
          "children": format_tree_data(answer.next_question)
        })
      }
    )
  }
  var question = {
    "title": tree_data.question,
    "children": children,
    "id": tree_data.id,
    "type": "Q",
    "page_id": tree_data.page_id
  }
  return [question]
}

class App extends Component {
  state = {
    tree_data: []
  }


  componentDidMount() {
    axios.get(`https://serene-brook-03900.herokuapp.com/questionget?question_id=2`)
      .then(res => {
        var Tree_Data = res.data;
        this.setState({ tree_data: format_tree_data(Tree_Data) })
      })
  }

  render() {

    console.log(this.state.tree_data);
    return (
      <Tree data={this.state.tree_data} />
    );
  }
}

export default App;
