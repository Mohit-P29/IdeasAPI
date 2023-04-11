import server from './server.js'

const PORT = process.env.PORT || 5000

server.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
