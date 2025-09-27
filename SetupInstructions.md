Quick Team Setup Instructions (Windows)
1. Clone the GitHub Repository
Open Command Prompt (or PowerShell).


Navigate to the folder where you want the project:


cd C:\path\to\your\projects

Clone the repository:


git clone https://github.com/<yourusername>/<yourrepo>.git

Enter the repo folder:


cd <yourrepo>


2. Backend Setup (Django + DRF)
2.1 Create a Python virtual environment
cd backend
python -m venv venv

Activate the virtual environment:
venv\Scripts\activate

You should see (venv) in the terminal prompt — that means your Python environment is now isolated.

2.2 Install backend dependencies
pip install -r requirements.txt

If requirements.txt is not yet created, install manually:
pip install django djangorestframework psycopg2-binary weasyprint django-cors-headers

Then save dependencies:
pip freeze > requirements.txt


2.3 Run database migrations
python manage.py migrate


2.4 Create superuser (optional, for admin panel)
python manage.py createsuperuser

Follow the prompts (username, email, password).

2.5 Run the backend server
python manage.py runserver

Backend will be available at: http://127.0.0.1:8000



3. Frontend Setup (React)
3.1 Install Node.js dependencies
cd ../frontend
npm install

This will install all packages listed in package.json (React, axios, react-router-dom, etc.)



3.2 Start the React development server
npm start

React frontend will open in your browser at: http://localhost:3000


Any changes you make in frontend/src/ will auto-refresh the page.
