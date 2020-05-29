// This needs to be the first line.
pragma solidity ^0.4.18;

// give your contract a name
contract ChattingContract {
  string name;
  string message;
  uint timeStamp;

  event chat (
    string name,
    string message,
    uint timeStamp);

  function setChat (string _name, string _msg) public {
    name = _name;
    message = _msg;
    timeStamp = now;
    emit chat(_name, _msg, now);
  }

  function getChat() public view returns(string, string, uint) {
    return (name, message, timeStamp);
  }
}