# Piano Web App

A simple piano application that runs in a web browser. Built with ReactJS, Express, MongoDB, and Docker.

## Features

- Interactive piano keyboard that can be played with mouse or computer keyboard
- Record and save melodies
- Play back saved melodies
- Containerized application using Docker

## Prerequisites

- Docker
- Docker Compose

## Getting Started

1. Clone this repository
2. Navigate to the project directory
3. Run the application using Docker Compose:

```bash
docker-compose up
```

4. Access the application at http://localhost:3000

## Application Structure

- **Frontend (React)**: Interactive piano interface, melody recording and playback
- **Backend (Express)**: API for saving and retrieving melodies
- **Database (MongoDB)**: Storage for saved melodies

## How to Use

1. Play the piano using your mouse or keyboard (A-K keys correspond to piano notes)
2. Click "Start Recording" to begin recording a melody
3. Play notes to add to your melody
4. Click "Stop Recording" when finished
5. Click "Save Melody" to save your creation
6. View and play back saved melodies in the list below

## Development

To modify the application:

1. Make changes to the client or server code
2. Rebuild the containers:

```bash
docker-compose up --build
```