# EatMe
Personal Food Manager Application
(_Currently REST API only, UI/UX still in progress_)

### Background and Motivation:

With limited kitchen space to store all of your groceries, it becomes very easy to forget about certain food items, especially if they are placed in the very back of a storage area (for example, a refrigerator or pantry) and not in plain sight.

EATME is designed to help you manage your groceries so that all of your food items are consumed before expiration.

### Current Features:

- JWT-based authentication/ authorization with password hashing using bcrypt
- CRUD functionalities for food items, storage areas, shopping lists, and recipes with sorting, searching/ filtering, and pagination implemented
- Single page application routing set up with minimalist UI for food items

### Future iterations recommendations:

- Develop UI/UX further to utilize authentication/ authorization and CRUD functionalities in the API
- Send reminders to user's account email when a food item is close to expiration (or update user schema to include phone numbers, and send text messages as reminders instead)
- Integration of third party APIs to suggest nearby supermarkets that carry specific food items in the user's shopping list or generate recipes that include ingredients based on the user's remaining food items

### Current tech stack

- Node/ Express
- MongoDB
- React, React router
- Webpack
