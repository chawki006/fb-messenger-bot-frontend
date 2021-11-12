import React, { Component } from "react";
import "./App.css";
import Tree from "./components/tree";
import axios from 'axios';
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


class App extends Component {
  state = {
    tree_data: []
  }


  componentDidMount() {
    axios.get(`https://serene-brook-03900.herokuapp.com/pagesget`)
      .then(res => {
        var pages = res.data;
        this.setState({ pages: pages })
      });
  }

  render() {
    let pages = this.state.pages ? this.state.pages : [];
    let root_path = pages.length > 0 ? <Route path='/' exact element={<Tree page={pages[0]} />} /> : <Route path='/' element={<div></div>} />
    return (
      <Router>
        <Navbar pages={pages} />
        <Routes>
          {root_path}
          {
            pages.map(page => {
              return <Route path={`/${page[1]}`} exact element={<Tree page={page} />} />
            })
          }
        </Routes>
      </Router>
    );
  }
}

export default App;
