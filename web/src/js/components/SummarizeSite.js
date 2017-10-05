import React, {Component} from 'react';


export default class SummarizeSite extends Component {

    constructor() {
        super();
    }


    render() {
        return (
            <div>
                <h1><span className="oi" data-glyph="link-intact"/> Summarization from a web site</h1>
                <Input id="username" label="Username" required/>

            </div>
            );
        }
}