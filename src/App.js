import React, { Component } from 'react';
import ToolbarComponent from './components/ToolbarComponent';
import MessagesComponent from './components/MessagesComponent';

class App extends Component {

  state = {
    messages: []
  }

  componentDidMount = async () => {
    const response = await fetch("http://localhost:8082/api/messages")
    const messages = await response.json()

    this.setState({
      messages: [
        ...this.state.messages,
        ...messages.map(message => ({
          ...message,
          selected: false
        }))
      ]
    })
  }

  toggleProperty = async (message, property) => {
    const index = this.state.messages.indexOf(message)

    this.setState({
      messages: [
        ...this.state.messages.slice(0, index),
        { ...message, [property]: !message[property] },
        ...this.state.messages.slice(index + 1)
      ]
    })
  }

  toggleStar = async message => {
    // PATCH request on starred
    await fetch("http://localhost:8082/api/messages", {
      method: "PATCH",
      body: JSON.stringify({
        messageIds: [message.id],
        command: "star",
        star: message.starred
      }),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })

    this.toggleProperty(message, "starred")
  }

  toggleSelect = message => {
    this.toggleProperty(message, "selected")
  }

  markReadStatus = async readStatus => {
    // filter out selected messages
    const selectedMessages = this.state.messages.filter(message => message.selected)

    // PATCH request on mark read status
    await fetch("http://localhost:8082/api/messages", {
      method: "PATCH",
      body: JSON.stringify({
        messageIds: [...selectedMessages.map(message => message.id)],
        command: "read",
        read: readStatus
      }),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })

    this.setState({
      messages: this.state.messages.map(message => (message.selected ? {...message, read: readStatus} : message))
    })
  }

  deleteMessages = () => {
    const messages = this.state.messages.filter(message => !message.selected);
    this.setState({ messages })
  }

  applyLabel = async label => {
    const messages = this.state.messages.map(message =>
      message.selected && !message.labels.includes(label)
        ? {...message, labels: [...message.labels, label].sort()}
        : message
    )
    // filter out selected messages
    const selectedMessages = this.state.messages.filter(message => message.selected)

    // PATCH request on applying labels
    await fetch("http://localhost:8082/api/messages", {
      method: "PATCH",
      body: JSON.stringify({
        messageIds: [...selectedMessages.map(message => message.id)],
        command: "addLabel",
        label
      }),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })

    this.setState({ messages })
  }

  removeLabel = async label => {
    const messages = this.state.messages.map(message => {
      const index = message.labels.indexOf(label)
      if (message.selected && index > -1) {
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
    // filter out selected messages
    const selectedMessages = this.state.messages.filter(message => message.selected)

    // PATCH request on applying labels
    await fetch("http://localhost:8082/api/messages", {
      method: "PATCH",
      body: JSON.stringify({
        messageIds: [...selectedMessages.map(message => message.id)],
        command: "removeLabel",
        label
      }),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })

    this.setState({ messages })
  }

  toggleSelectAll = () => {
    const selectedMessages = this.state.messages.filter(message => message.selected)

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
