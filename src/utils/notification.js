function showNotification(message, type) {
  let hovered = false;
  const duration = 8000;
  const updateInterval = 50;

  const notificationContainer = document.querySelector(
    ".notification-container"
  );
  if (!notificationContainer) {
    const container = document.createElement("div");
    container.className = "notification-container";
    document.body.appendChild(container);
  }

  const notificationElement = document.createElement("div");
  notificationElement.className = `notification ${type}`;

  const iconElement = document.createElement("i");
  if (type == "info") {
    iconElement.className = "fas fa-info-circle icon";
  } else if (type == "success") {
    iconElement.className = "fas fa-check-circle icon";
  } else if (type == "error") {
    iconElement.className = "fas fa-times-circle icon";
  } else if (type == "warning") {
    iconElement.className = "fas fa-exclamation-circle icon";
  }
  notificationElement.appendChild(iconElement);

  const messageElement = document.createElement("span");
  messageElement.innerText = message;
  notificationElement.appendChild(messageElement);

  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  progressBar.style.backgroundColor = "#f0f0f0";
  notificationElement.appendChild(progressBar);

  const container = document.querySelector(".notification-container");
  container.appendChild(notificationElement);

  notificationElement.offsetHeight;

  notificationElement.classList.add("show");

  let clicked = false;

  function removeNotification() {
    notificationElement.classList.remove("show");
    setTimeout(function () {
      notificationElement.remove();
      if (!container.children.length) {
        container.remove();
      }
    }, 500);
  }

  let currentTime = 0;
  const totalSteps = duration / updateInterval;
  const progressStep = 100 / totalSteps;
  const progressInterval = setInterval(function () {
    currentTime += updateInterval;
    const progress = (currentTime / duration) * 100;
    progressBar.style.width = `${progress}%`;

    if (currentTime >= duration) {
      clearInterval(progressInterval);
    }
  }, updateInterval);

  notificationElement.addEventListener("click", function () {
    clearInterval(progressInterval);
    removeNotification();
  });

  notificationElement.addEventListener("mouseenter", function () {
    hovered = true;
    notificationElement.classList.add("hovered");
  });

  notificationElement.addEventListener("mouseleave", function () {
    hovered = false;
    notificationElement.classList.remove("hovered");
  });

  setTimeout(function () {
    if (!clicked && !hovered) {
      clearInterval(progressInterval);
      removeNotification();
    }
  }, duration);
}

export { showNotification };
