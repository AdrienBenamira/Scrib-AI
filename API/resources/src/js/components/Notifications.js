import React from 'react';
import Message from "./glui/messages/Message";

export default class Notifications extends React.Component {

    render() {
        return (
            <div className="messages">
                {/*Summarization failed*/}
                {this.props.text.failed ? (
                    <Message timer={30} error>
                        {this.props.text.errorMessage}
                    </Message>
                ) : null}
                {/*Summary ready*/}
                {this.props.text.summarized ? (
                    <Message success timer={10}>
                        Your summary is ready! (Took {Math.round(this.props.text.summary.chrono)} seconds).<br/>
                        Please rank our summary to help us improve the result!
                    </Message>
                ) : null}
                {/*Summarization in progress*/}
                {this.props.text.summarizing ? (
                    <Message default>
                        Summarization in progress...
                    </Message>
                ) : null}
                {/*Upload in progress*/}
                {this.props.text.upload.uploading ? (
                    <Message default>
                        Uploading...
                    </Message>
                ) : null}
                {/*Summary uploaded to API*/}
                {this.props.text.upload.done ? (
                    <Message success timer={10}>
                        Your summary has successfully been saved! Thanks!
                    </Message>
                ): null}
                {/*Error Message for upload */}
                {this.props.text.upload.failed ? (
                    <Message error timer={10}>
                        {this.props.text.upload.errorMessage}
                    </Message>
                ):null}
                {/*User added*/}
                {this.props.user.signup.done ? (
                    <Message success timer={10}>
                        The user has successfully been added.
                    </Message>
                ):null}
                {/*Error user upload*/}
                {this.props.user.signup.failed ? (
                    <Message error timer={10}>
                        {this.props.user.signup.errorMessage}
                    </Message>
                ):null}
                {/*Error stats*/}
                {this.props.stats.failed ? (
                    <Message error timer={10}>
                        {this.props.stats.errorMessage}
                    </Message>
                ):null}
            </div>
        );
    }
}