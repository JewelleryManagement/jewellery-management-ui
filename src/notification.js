function showNotification(message, type) {
    const notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
      const container = document.createElement('div');
      container.className = 'notification-container';
      document.body.appendChild(container);
    }
  
    const notificationElement = document.createElement('div');
    notificationElement.className = `notification ${type}`;
  
    const iconElement = document.createElement('i');
    if (type == 'info') {
        iconElement.className = 'fas fa-info-circle icon';
    }else if (type == 'success') {
        iconElement.className = 'fas fa-check-circle icon';
    }else if (type == 'error') {
        iconElement.className = 'fas fa-times-circle icon';
    }else if (type == 'warning') {
        iconElement.className = 'fas fa-exclamation-circle icon';
    }
    notificationElement.appendChild(iconElement);
  
    const messageElement = document.createElement('span');
    messageElement.innerText = message;
    notificationElement.appendChild(messageElement);
  
    const container = document.querySelector('.notification-container');
    container.appendChild(notificationElement);
  
    notificationElement.offsetHeight;
  
    notificationElement.classList.add('show');
  
    setTimeout(function () {
      notificationElement.classList.remove('show');
      setTimeout(function () {
        notificationElement.remove();
        if (!container.children.length) {
          container.remove();
        }
      }, 500);
    }, 8000);
  }
  
  export { showNotification };
  