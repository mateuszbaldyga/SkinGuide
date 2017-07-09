import React from "react";
import ReactDOM from "react-dom";
import Comment from './components/comment.js'

const app = document.getElementById('app');

//renders Comment to app:
ReactDOM.render(<Comment/>, app);

if (module.hot) {
  // module.hot.accept(Comment, function() {render(app)});
  module.hot.accept(Comment);
}