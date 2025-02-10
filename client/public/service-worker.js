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
    if (!event.data) return;

    const data = event.data.json();
    console.log("Received push notification:", data);

    self.registration.showNotification(data.title, {
        message: data.message,
        icon: data.icon,
    });

    // Send the notification data to the main thread (React App)
    self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
            client.postMessage(data);
        });
    });
});

