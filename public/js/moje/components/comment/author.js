import React from "react";

export default class Author extends React.Component {
 //  constructor() {
 //    super(); //always has to be called
 //    this.author = 'Mati'
	// this.state = {lastn: 'baldyga'}; //state
 //  }
	render () {

		console.log("props", this.props);
		// this.props.changeTitle();
		return (
      // <h1>essa</h1>
			<h1 title={title}>HEJ</h1>
		);
	}
}