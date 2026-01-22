# What is Render?

**Render** is a cloud hosting platform (Unified Cloud) that allows you to host websites and applications easily.

## Why are we using Render for the Backend?

For your *Code Nudi* project, Render is being used specifically for the **Django Backend**. Here is why it is the perfect choice:

1.  **Persistent Server**: Unlike Vercel (which is "Serverless" and shuts down when not used), Render provides a "persistent" server. Your Django app needs to stay alive to listen for **WebSocket connections** (the technology that powers your Interactive Terminal).
2.  **Native Python Support**: Render understands Python and Django out of the box. It can easily run commands like `pip install` and `python manage.py runserver` (or `daphne` in production).
3.  **Managed Database**: Render provides a free PostgreSQL database that connects automatically to your backend. This is where your users and saved files will be stored.

## How it Works (The "Blueprint")

Your project contains a special file called `render.yaml`. This acts as a set of instructions for Render:

1.  **"Here is my code"**: It points to your GitHub repo.
2.  **"Build it like this"**: It tells Render to run `pip install -r requirements.txt`.
3.  **"Run it like this"**: It tells Render to start the `daphne` server.

## What you need to do

Since you have the `render.yaml` file:
1.  You check "Blueprint" in the Render dashboard.
2.  Render reads the file and sets up everything for you.
3.  **Crucial Step**: You just need to paste your **Environment Variables** (like the `HF_TOKEN` you just got) into the dashboard so the server has the "keys" to use the AI tools.
