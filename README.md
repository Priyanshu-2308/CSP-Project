# Keepr – A Simple Watchlist Manager

Keepr is a simple web project built using **HTML, CSS, JavaScript, PHP, and JSON**.

It allows users to:

- **User Account System**
  - Create an account  
  - Log in / Log out  

- **Watchlist Management**
  - Add items to a watchlist  
  - Categorize items into:
    - Watching  
    - Watched  
    - Plan to Watch  

- **Additional Item Details**
  - Add notes  
  - Add genres  
  - Add platform/streaming links  

- **Smart Search & UI**
  - Search items  
  - Auto-change theme based on genre keywords  

- **Item Controls**
  - Edit items  
  - Delete items  

- **Profile System**
  - Update profile name  
  - Upload a profile picture (stored as Base64)  

- **Local Storage**
  - All data is saved inside a local file: `data.json`  

---

## 📁 Project Structure 

/Keepr<br>
│── index.html <br>
│── style.css<br>
│── script.js<br>
│── backend.php<br>
│── data.json<br>


---

##  Requirements

To run the project locally, you need:

- A modern web browser  
- **PHP 7+** installed  
- No database (JSON storage is used)

---

##  Installation & Running

### 1. Download the Project

Clone the repository:

git clone https://github.com/Priyanshu-2308/CSP-Project

Or download ZIP → Extract it.

### 2. Verify PHP Installation

Run:

php -v


If PHP is not installed, download it from:

https://www.php.net/downloads.php

### 3. Start a Local PHP Server

Open a terminal in the project directory:

cd Keepr

php -S localhost:8000

You should see:

PHP development server started at http://localhost:8000


### 4. Open the App

Go to:

http://localhost:8000


---

##  How to Use the App

### Authentication
- Sign up with name, email, and password  
- Log in with your credentials  
- User data is stored in `data.json`

### Adding an Item
- Click the **＋ button**
- Fill in:
  - Title  
  - Status  
  - Genre  
  - Platform link  
  - Notes  

### Editing or Deleting Items
Each card contains:
- **Edit**
- **Delete**

### Smart Search & Theme Change
- Type keywords such as:
  - romance  
  - thriller  
  - action  
  - horror  
- The UI theme changes automatically based on the genre.

### Profile Section
- Update your display name  
- Upload a profile picture  
- Log out  

---

##  Backend Overview (backend.php)

The backend handles:

- Signup  
- Login  
- Logout  
- Load profile  
- Save profile  
- Save item  
- Edit item  
- Delete item  
- Return all items  

Example data structure:

data.json <br>
{<br>
"users": [],<br>
"items": []<br>
}


---

##  Troubleshooting

### Blank Page / UI Not Loading
- You must run the PHP server  
- Opening `index.html` alone will NOT work

### Items Not Appearing
- Search bar may be filtering items  
- Ensure `data.json` is writable  
- Check browser console

### Profile Picture Not Saving
- Browsers block file access without a server  
- Always run using `php -S localhost:8000`

---



