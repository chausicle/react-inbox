import React, { Component } from 'react';
import MessageComponent from './MessageComponent';

class MessagesComponent extends Component {
  render() {
    // console.log("this.props on messages component = ", this.props);
    const { messages, toggleStar, toggleSelect } = this.props

    return (
      <div className="MessagesComponent">
        {messages.map(message => (
          <MessageComponent
            key={message.id}
            message={message}
            toggleStar={toggleStar}
            toggleSelect={toggleSelect}
          />
        ))}
      </div>
    );
  }
}

export default MessagesComponent;
