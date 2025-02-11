// self.addEventListener("push", (event) => {
//     if (!event.data) {
//         console.log("No data in push event");
//         return;
//     }
//     const data = event.data.json();
//     console.log("data in service worker is", data);
//     self.registration.showNotification(data.title, {
//         body: data.body,
//         icon: data.icon
//     });
// });


self.addEventListener("push", (event) => {
    if (!event.data) {
      console.error("Push event has no data");
      return;
    }
  
    const data = event.data.json();
    console.log("Received push notification:", data);
  
    self.registration.showNotification(data.title, {
      body: data.message, // Use `body` instead of `message`
      icon: data.icon,
    });
  
    // Send the notification data to the main thread (React App)
    self.clients.matchAll().then((clients) => {
      if (clients.length === 0) {
        console.log("No clients are currently connected.");
      } else {
        clients.forEach((client) => {
          console.log("Sending notification to client:", client);
          client.postMessage(data);
        });
      }
    }).catch((error) => {
      console.error("Error sending notification to clients:", error);
    });
  });
