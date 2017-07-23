import React from "react";
import Author from './comment/author'

export default class Comment extends React.Component {
  constructor() {
    super(); //always has to be called
    this.name = 'Mati'
	  this.state = {title: 'emteess'}; //state
  }
  changeTitle(title) {
  	this.setState({title}) //to samo: {title: title}

  }

	render () {
    const title = "welcome emtees"; //props
		return (
			<div>
				<Author changeTitle={this.changeTitle.bind(this)}/>
				<h1 title>HEJ {this.state.title}</h1>
			</div>
		);
	}
}

if (module.hot) {
  // module.hot.accept(Comment, function() {render(app)});
  module.hot.accept(Author);
}