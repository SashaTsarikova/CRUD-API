// if (cluster.isPrimary) {
//   const count = os.cpus().length;
//   console.log(`Master pid ${process.pid}`);
//   console.log(`Starting ${count} forks`);
//   for (let forkNumber = 0; forkNumber < count; forkNumber += 1) {
//     const worker = cluster.fork();
//     worker.on("exit", (code, signal) => {
//       if (signal) {
//         console.log(`worker was killed by signal: ${signal}`);
//       } else if (code !== 0) {
//         console.log(`worker exited with error code: ${code}`);
//       } else {
//         console.log("worker success!");
//       }
//     });
//   }
// } else {
//   const server = http.createServer(requestListener).listen(PORT, HOSTNAME);

//   server.on("clientError", (err, socket) => {
//     socket.end("Bad request");
//   });
//   console.log(`Worker is running with id ${cluster.worker.id}`);
// }