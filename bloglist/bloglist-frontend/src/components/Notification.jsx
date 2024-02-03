const Notification = ({ message, isError }) => {
  const notificationStyle = {
    color: 'green',
    fontStyle: 'italic',
    background: 'lightgrey',
    fontSize: 16,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  const errorStyle = {
    color: 'red',
    fontStyle: 'italic',
    background: 'lightgrey',
    fontSize: 16,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  if (message === null) {
    return null;
  }

  return (
    <div id='notification' style={isError ? errorStyle : notificationStyle}>
      {message}
    </div>
  );
};

export default Notification;
