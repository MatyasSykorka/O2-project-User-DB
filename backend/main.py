# importing important libreies
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware


from pydantic import BaseModel

# importing important libraries for database connection
import psycopg2
import psycopg2.extras

import re

# importing file that store DB connection data
# this file isn't in the repository
import o2_security


# global variable for FastAPI function
app = FastAPI()

# CORS settings
origins = [
    "http://127.0.0.1:3000",    # frontend origin
    "http://localhost:3000"
]

# security
# add middleware for CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # Allow specific origins
    allow_credentials=True,
    allow_methods=["*"],        # Allow all methods
    allow_headers=["*"],        # Allow all headers
)

# function with parameters for database connection
def connect():
    conn = psycopg2.connect(
        host=o2_security.host,
        database=o2_security.database,
        user=o2_security.user,
        password=o2_security.password,
        port=o2_security.port
    )

    return conn


# root
@app.get("/")
async def root():
    return {"Message": "It works!"} # test code :)

# getting all users
@app.get("/users")
async def Get_all_users():
    # variable which store SQL command for get all data from DB
    query = f"select users.id, users.name, users.surname, users.username, users.email, users.role, roles.name as role_name from public.users left join public.roles on public.users.role = public.roles.id order by users.id;"
    # print(query)

    # connect to DB
    conn = connect() 
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    # executing command in DB
    cur.execute(query)
    pole_uzivatelu = cur.fetchall()

    # end communication with DB
    cur.close()
    conn.close()

    return pole_uzivatelu

"""
foreach cyklus 

for user in pole_uzivatelu:
    print(user)
print(users)
"""

# user registration model
class AddUserRequestBody(BaseModel):
    name: str
    surname: str
    username: str
    email: str | None = None
    password: str

# User registation, adding user to DB
@app.post("/register")
async def new_user(body: AddUserRequestBody):
    print(body)
    # if user haven't an email, converting to database [NULL]
    email = "NULL"
    if (body.email is not None): email = f"'{body.email}'"

    # check password correction
    if (
        len(body.password) < 8
        & body.password.find('#')
        | body.password.find('*')
        | body.password.find('/')
        | body.password.find('&')
        | body.password.find('$')
        | body.password.find('§')
        | body.password.find("<")
        | body.password.find('>')
        | body.password.find('_')
        | body.password.find('-')
        | body.password.find('{')
        | body.password.find('}')
        | body.password.find('\\')
        | body.password.find('|')
        | body.password.find('€')
        | body.password.find('+')
        | body.password.find('[')
        | body.password.find(']')
        | body.password.find('@')
        & body.password.find('0')
        | body.password.find('1')
        | body.password.find('2')
        | body.password.find('3')
        | body.password.find('4')
        | body.password.find('5')
        | body.password.find('6')
        | body.password.find('7')
        | body.password.find('8')
        | body.password.find('9')
    ):
        raise HTTPException(
            status_code=status.HTTP_417_EXPECTATION_FAILED, 
            detail="Your password doesn't meet the requirements!"
        )
    
    if (not any(char.isupper() for char in body.password)):
        raise HTTPException(
            status_code=status.HTTP_417_EXPECTATION_FAILED, 
            detail="Password does not have a uppercase character!"
        )
    if (not re.search('[A-Z]', body.password)):
        raise HTTPException(
            status_code=status.HTTP_417_EXPECTATION_FAILED, 
            detail="Password does not have a special character!"
        )


    # SQL function to add user to DB
    query = f"insert into public.users (name, surname, username, email, password) values ('{body.name}', '{body.surname}', '{body.username}', {email}, '{body.password}');"
    # print(query)

    conn = connect()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    try:
        cur.execute(query)
        conn.commit()
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User creation failed")

    cur.close()
    conn.close()

    # logs
    # print(f"Nový uživatel {body.name} {body.surname} byl vytvořen.")
    return {"status": "ok"}

# login user model 
class LogIn(BaseModel):
    username: str
    password: str

# User login
@app.post("/login")
async def User_login(body: LogIn):
    """
    print(body.username)
    print(body.password)
    """

    query = f"select count(*) from public.users where username='{body.username}' AND password='{body.password}';"

    print(query)

    conn = connect()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    cur.execute(query)
    result = cur.fetchone()

    cur.close()
    conn.close()

    count = result["count"]
    print(count)

    if(count != 0):
        return {"status": "OK"}
    else:
        return {"status": "ERROR"}
    
# getting user information via ID or username
@app.get("/get_user")
async def Get_User(
        id: int | None = None, 
        username: str | None = None
    ):
    """
    print(id)
    print(username)
    """

    # if user didn't type username or ID, function doesn't execute
    if (id == None and username == None):
        return {"error": "Není uvedené ID nebo username pro zjištění uživatele!"}
    
    if (id != None):
        query = f"select users.id, users.name, users.surname, users.username, users.email, users.role, roles.name as role_name from public.users join public.roles on users.role=roles.id where id={id};"
        print(query)
    else:
        query = f"select users.id, users.name, users.surname, users.username, users.email, users.role, roles.name as role_name from public.users join public.roles on users.role=roles.id where username='{username}';"
        print(query)

    conn = connect()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    cur.execute(query)
    User = cur.fetchone()

    cur.close()
    conn.close()


    # for UsersName in UserID:
    #     print(UsersName)

    print(User)
    return User

# delete user from update profile page
@app.delete("/update-profile")
async def Delete_User(
        id: int | None = None, 
        username: str | None = None
    ):
    if (id == None and username == None):
        return {"error": "Není uvedené ID nebo username pro smazání uživatele v profilu!"}
    
    if(id != None):
        query = f"delete from public.users where id={id};"
        print(query)
        print(f"Uživatel s ID {id} byl smazán.")
    else:
        query = f"delete from public.users where username='{username}';"
        print(query)
        print(f"Uživatel s uživatelským jménem \"{username}\" byl smazán.")

    conn = connect()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    cur.execute(query)
    conn.commit()

    cur.close()
    conn.close()

    return {"status": "Ok"}

# delete user from the DB by ID or username
@app.delete("/user")
async def Delete_User(
        id: int | None = None, 
        username: str | None = None
    ):
    if (id == None or username == None):
        return {"error": "Není uvedené ID nebo username pro smazání uživatele z databáze!"}
    
    if(id != None):
        query = f"delete from public.users where id={id};"
        print(query)
        print(f"Uživatel s ID {id} byl smazán.")
    else:
        query = f"delete from public.users where username='{username}';"
        print(query)
        print(f"Uživatel s uživatelským jménem \"{username}\" byl smazán.")

    conn = connect()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    cur.execute(query)
    conn.commit()

    cur.close()
    conn.close()

    return {"status": "Ok"}

"""
{
    "username": "admin",
    "password":"admin"
}
select z databáze, kde je username (username) a password (password)
select count(*) as pocet_uzivatelu from users where ...
pokud to vrátí počet řádků > 0 == přihlášeno
pocet radku == 0 => nepřihlášen
"""

# class for reciving user data for update user profile
class UserUpdate(BaseModel):
    id: int
    name: str
    surname: str
    email: str

# update profile
@app.post("/update_user")
async def User_update(body: UserUpdate):
    print(f"{body.id} {body.name} {body.surname} {body.email} + ")
    email = "NULL"
    if (body.email is not None): email = f"'{body.email}'"

    conn = connect()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    
    if (body.name != None):
        query = f"update public.users set name='{body.name}' where id={body.id};"
        print(query)

        cur.execute(query)
        conn.commit()

    if (body.surname != None):
        query = f"update public.users set surname='{body.surname}' where id={body.id};"
        print(query)

        cur.execute(query)
        conn.commit()


    if (body.email != None):
        query = f"update public.users set email='{body.email}' where id={body.id};"
        print(query)

        cur.execute(query)
        conn.commit()

    cur.close()
    conn.close()

    return {"status": "Profile updated"}

"""
REQUEST
{
    "username": "admin",
    "old_password": "admin",
    "new_password": "new_admin"
}

select starého hesla z DB
porovnání st. hesla z DB se starým heslem z requestu
update databáze: nastavení password=body.new_pass kde je username = username
"""

# password update model
class UpdatePW(BaseModel):
    username: str
    old_password: str
    new_password: str
    sec_new_password: str

# update password
@app.post("/update_password")
async def New_Password_Request(body: UpdatePW):
    print(f"{body.username} {body.old_password} {body.new_password} {body.sec_new_password}")

    query = f"select count(*) from public.users where username='{body.username}' and password='{body.old_password}';"
    print(query)

    conn = connect()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    cur.execute(query)
    result = cur.fetchone()

    cur.close()
    conn.close()

    count = result["count"]
    print(count)

    if(count != 0):
        if (
            len(body.new_password) < 8
            & body.new_password.find('#')
            | body.new_password.find('*')
            | body.new_password.find('/')
            | body.new_password.find('&')
            | body.new_password.find('$')
            | body.new_password.find('§')
            | body.new_password.find("<")
            | body.new_password.find('>')
            | body.new_password.find('_')
            | body.new_password.find('-')
            | body.new_password.find('{')
            | body.new_password.find('}')
            | body.new_password.find('\\')
            | body.new_password.find('|')
            | body.new_password.find('€')
            | body.new_password.find('+')
            | body.new_password.find('[')
            | body.new_password.find(']')
            | body.new_password.find('@')
            & body.new_password.find('0')
            | body.new_password.find('1')
            | body.new_password.find('2')
            | body.new_password.find('3')
            | body.new_password.find('4')
            | body.new_password.find('5')
            | body.new_password.find('6')
            | body.new_password.find('7')
            | body.new_password.find('8')
            | body.new_password.find('9')
        ):
            raise HTTPException(
                status_code=status.HTTP_417_EXPECTATION_FAILED, 
                detail="Your password doesn't meet the requirements!"
            )
        
        if (not any(char.isupper() for char in body.new_password)):
            raise HTTPException(
                status_code=status.HTTP_417_EXPECTATION_FAILED, 
                detail="Password does not have capitan character!"
            )
        if (not re.search('[A-Z]', body.new_password)):
            raise HTTPException(
                status_code=status.HTTP_417_EXPECTATION_FAILED, 
                detail="Password does not have special character!"
            )
        

        query = f"update public.users set password='{body.new_password}' where username='{body.username}';"
        print(query)

        conn = connect()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        cur.execute(query)
        conn.commit()

        cur.close()
        conn.close()

        return {"Password_change_status": "New password aplicated"}
    else:
        raise HTTPException(
                status_code=status.HTTP_417_EXPECTATION_FAILED, 
                detail="Password does not have special character!"
            )
    
    """
    --- wrong code to check old password ---

    query_OldPasswordCheck = f"select password from public.users where username='{body.username}';"
    print(query_OldPasswordCheck)
    
    if (query_OldPasswordCheck != body.old_password):
        return HTTPException(
            status_code=status.HTTP_417_EXPECTATION_FAILED, 
            detail="Typed old password in not same!"
        )
    
    conn = connect()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    cur.execute(query_OldPasswordCheck)
    result = cur.fetchone()

    cur.close()
    conn.close()

    password = result["password"]
    # print(count)
    print(password)

    count = result["count"]
    print(count)
    if(count != 0):
        return {"status": "OK"}
    else:
        return {"status": "ERROR"}
    
    """

# main admin give admin permission
@app.put("/giveAdmin") 
async def GiveAdminPermission(
        id: int | None = None, 
        role: int | None = None, 
        username: str | None = None
    ):
    print(f"{id}, {role}")
    if (id == None and username == None):
        return {"error": "Není uvedené ID nebo role!"}

    if (role != 1):
        query = f"update public.users set role=1 where id={id};"
        print(query)
        print(f"Uživatel s ID {id} získal práva administrátora.")
    else:
        query = f"update public.users set role=2 where id={id};"
        print(query)
        print(f"Uživatel s ID {id} nemá práva administrátora.")

    conn = connect()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    cur.execute(query)
    conn.commit()

    cur.close()
    conn.close()


    queryII = f"delete from public.tickets where username='{username}';"

    conn = connect()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    cur.execute(queryII)
    conn.commit()

    cur.close()
    conn.close()

    return {"status": "Ok"}

# getting all admin permission tickets
@app.get("/show_tickets")
async def Get_all_tickets():
    # proměná k provedení příkazu v databáti, vybere id, jméno, příjmení, uživetelské jméno, email a roli, které jsou místo čísel role převedeny na název role
    #
    query = f"select tickets.id, tickets.name, tickets.surname, tickets.username, tickets.email, tickets.role, roles.name as role_name from tickets left join public.roles on tickets.role = public.roles.id order by tickets.id;"
    # print(query)

    # připojení k databázi
    conn = connect() 
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    # executeing command in database
    cur.execute(query)
    # variable with function output
    pole_uzivatelu = cur.fetchall()

    # end communication with DB
    conn.close()
    cur.close()

    return pole_uzivatelu

# admin asks the main admin to add new user to the admin group
@app.put("/move_to_tickets")
async def Post_to_Tickets(
        id: int | None = None,
        name: str | None = None,
        surname: str | None = None,
        username: str | None = None,
        email: str | None = None,
        role: int | None = None
    ):
    print(f"{id} {name} {surname} {username} {email} {role}")
    if (username == None):
        return {"error": "Není uvedené ID"}


    query=f"insert into public.tickets (id, name, surname, username, email, role) values ({id}, '{name}', '{surname}', '{username}', '{email}', {role});"
    print(query)

    conn = connect()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    cur.execute(query)
    conn.commit()

    cur.close()
    conn.close()
    
    print(f"Uživatel s username {username} je v žádankách.")
    return {"change_permission_status": "OK"}

# main admin rejects to give admin permission to user 
@app.delete("/reject-permission")
async def RejectPermission(
        username: str | None = None
    ):
    if (username == None):
        return {"error": "Není_uvedený_username_pro_odmítnutí_práv!"}
    
    if(username != None):
        query = f"delete from public.tickets where username='{username}';"
        print(query)
        print(f"Uživatel s ID {username} byl smazán.")

    conn = connect()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    cur.execute(query)
    conn.commit()

    cur.close()
    conn.close()

    return {"status": "Ok"}