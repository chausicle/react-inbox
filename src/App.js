import React, { Component } from 'react';
import ToolbarComponent from './components/ToolbarComponent';
import MessagesComponent from './components/MessagesComponent';

class App extends Component {

  state = {
    messages: this.props.messages
  }

  toggleProperty = (message, property) => {
    const index = this.state.messages.indexOf(message);
    this.setState({
      messages: [
        ...this.state.messages.slice(0, index),
        { ...message, [property]: !message[property] },
        ...this.state.messages.slice(index + 1)
      ]
    })
  }

  toggleStar = message => {
    this.toggleProperty(message, "starred")
  }

  toggleSelect = message => {
    this.toggleProperty(message, "selected");
  }

  markReadStatus = readStatus => {
    this.setState({
      messages: this.state.messages.map(message => (message.selected ? {...message, read: readStatus} : message))
    })
  }

  deleteMessages = () => {
    const messages = this.state.messages.filter(message => !message.selected);
    this.setState({ messages })
  }

  applyLabel = label => {
    const messages = this.state.messages.map(message =>
      message.selected && !message.labels.includes(label)
        ? {...message, labels: [...message.labels, label].sort()}
        : message
    )

    this.setState({ messages })
  }

  removeLabel = label => {
    const messages = this.state.messages.map(message => {
      const index = message.labels.indexOf(label)
      if (messages.selected && index > -1) {
        return {
          ...message,
          labels: [
            ...message.labels.slice(0, index),
            ...message.labels.slice(index + 1)
          ]
        }
      }
      return message
    })

    this.setState({ messages })
  }

  toggleSelectAll = () => {
    const selectedMessages = this.state.messages.filter(message => message.selected);

    const selected = selectedMessages.length !== this.state.messages.length
    this.setState({
      messages: this.state.messages.map(message => message.selected !== selected ? { ...message, selected } : message)
    })
  }


  render() {
    return (
      <div className="App">
        <ToolbarComponent
          messages={this.state.messages}
          toggleSelectAll={this.toggleSelectAll}
          markReadStatus={this.markReadStatus}
          deleteMessages={this.deleteMessages}
          applyLabel={this.applyLabel}
          removeLabel={this.removeLabel}
        />
        <MessagesComponent
          messages={this.state.messages}
          toggleStar={this.toggleStar}
          toggleSelect={this.toggleSelect}
        />
      </div>
    );
  }
}

export default App;
